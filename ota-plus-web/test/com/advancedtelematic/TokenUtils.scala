package com.advancedtelematic

import java.security.{KeyPair, KeyPairGenerator, PrivateKey}

import org.jose4j.jws.{AlgorithmIdentifiers, JsonWebSignature}
import play.api.libs.json.{JsObject, Json}

object TokenUtils {
  def genKeyPair(): KeyPair = {
    KeyPairGen.generateKeyPair()
  }

  private val KeyPairGen = {
    val kpg = KeyPairGenerator.getInstance("RSA")
    kpg.initialize(2048)
    kpg
  }

  def identityTokenFor(subj: String, secretKey: PrivateKey, keyId: String): String = {
    val payload = Json.obj(
      "sub"     -> subj
    )
    signToken(payload, secretKey, keyId)
  }

  def identityTokenFor(subj: String): String = {
    identityTokenFor(subj, genKeyPair().getPrivate, "secret")
  }

  def signToken(claims: JsObject, secret: PrivateKey, keyId: String): String = {
    val signer = new JsonWebSignature()
    signer.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA512)
    signer.setKey(secret)
    signer.setKeyIdHeaderValue(keyId)
    signer.setPayload(Json.stringify(claims))
    signer.getCompactSerialization
  }

}
