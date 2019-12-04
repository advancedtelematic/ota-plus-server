package com.advancedtelematic.api.clients

import akka.stream.Materializer
import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.api.Errors.RemoteApiParseError
import com.advancedtelematic.api.{ApiClientExec, ApiRequest, OtaPlusConfig}
import com.advancedtelematic.libtuf.data.TufCodecs.tufKeyPairDecoder
import com.advancedtelematic.libtuf.data.TufDataType.TufKeyPair
import play.api.Configuration
import play.api.http.Status

import scala.concurrent.{ExecutionContext, Future}

class KeyServerApi(val conf: Configuration, val apiExec: ApiClientExec)
                  (implicit tracer: ZipkinTraceServiceLike) extends OtaPlusConfig {
  private def request(path: String)(implicit traceData: TraceData) =
    ApiRequest.traced("keyserver", keyServerApiUri.uri + "/api/v1/" + path)

  def targetKeys(repoId: String)
                (implicit ec: ExecutionContext, mat: Materializer, traceData: TraceData): Future[Seq[TufKeyPair]] = {
    // using circe since there is a decoder for it in the lib
    import io.circe.{parser => CirceParser}

    for {
      result <- request(s"root/$repoId/keys/targets/pairs").execResult(apiExec)
      byteString <- result.body.consumeData
    } yield {
      if (result.header.status == Status.NOT_FOUND) {
        Seq.empty
      } else {
        val parsed = CirceParser.parse(byteString.utf8String) match {
          case Left(t) =>
            throw RemoteApiParseError(s"error parsing target keys (${byteString.utf8String}): ${t.message}")
          case Right(json) =>
            json
        }

        val vector = parsed.asArray.getOrElse(throw new Exception("Vector expected"))
        vector.map { json =>
          tufKeyPairDecoder.decodeJson(json) match {
            case Left(t) => throw t
            case Right(keyPair) => keyPair
          }
        }
      }
    }
  }
}
