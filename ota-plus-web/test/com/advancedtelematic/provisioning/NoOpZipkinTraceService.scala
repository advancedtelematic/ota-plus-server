package com.advancedtelematic.provisioning

import brave.Tracing
import brave.play.ZipkinTraceServiceLike
import zipkin2.Span
import zipkin2.reporter.Reporter

import scala.collection.mutable.ListBuffer
import scala.concurrent.ExecutionContext

class NoOpZipkinTraceService extends ZipkinTraceServiceLike {
  override implicit val executionContext: ExecutionContext = ExecutionContext.global
  val reporter = new TestReporter()
  override val tracing: Tracing = {
    val t = Tracing.newBuilder().supportsJoin(false).spanReporter(reporter).build()
    t.setNoop(true)
    t
  }
}

class TestReporter extends Reporter[Span] {
  val spans = new ListBuffer[Span]()

  override def report(span: Span): Unit = spans += span
}
