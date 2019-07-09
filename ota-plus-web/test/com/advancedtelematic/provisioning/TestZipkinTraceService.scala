package com.advancedtelematic.provisioning

import brave.Tracing
import brave.play.ZipkinTraceServiceLike
import zipkin2.Span
import zipkin2.reporter.Reporter

import scala.collection.mutable.ListBuffer
import scala.concurrent.ExecutionContext

class TestZipkinTraceService extends ZipkinTraceServiceLike {
  override implicit val executionContext: ExecutionContext = ExecutionContext.global
  val reporter = new TestReporter()
  override val tracing: Tracing = Tracing.newBuilder().spanReporter(reporter).build()
}

class TestReporter extends Reporter[Span] {
  val spans = new ListBuffer[Span]()

  override def report(span: Span): Unit = spans += span
}
