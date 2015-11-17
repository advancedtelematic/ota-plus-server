package org.genivi.sota.core.jsonrpc

/**
 * Trait including utilities for generating randomr JSON values
 * Used by property-based tests
 */
trait JsonGen {

  import io.circe.Json
  import org.scalacheck.Arbitrary
  import org.scalacheck.Gen

  val JBooleanGen : Gen[Json] = Gen.oneOf(true, false).map( Json.bool )
  val JStrGen : Gen[Json] = Arbitrary.arbString.arbitrary.map( Json.string )
  val JNumGen : Gen[Json] = Arbitrary.arbInt.arbitrary.map( Json.int )
  val JNullGen: Gen[Json] = Gen.const( Json.Empty )

  val JsonGen : Gen[Json] = Gen.oneOf( JBooleanGen, JStrGen, JNumGen, JNumGen)

  implicit val arbJson : Arbitrary[Json] = Arbitrary( JsonGen )

}

object JsonGen extends JsonGen
