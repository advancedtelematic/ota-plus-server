package com.advancedtelematic.logging

import scala.concurrent.{ ExecutionContext, Future }
import scalaz.EitherT
import treelog.LogTreeSyntax

object OtaLogTreeSyntax extends LogTreeSyntax[Throwable] {

  import treelog.LogTreeSyntaxWithoutAnnotations.NothingShow
  import scalaz.{ Show, \/ }

  implicit class FutureSyntax[A](future: Future[A])(implicit ec: ExecutionContext) {
    import scalaz.syntax.id._

    def describe(description: String): AsyncDescribedComputation[A] = 
      future
        .map[DescribedComputation[A]]( _ ~> description )
        .recover { case t => failure[A](description) ~~ t } |> AsyncDescribedComputation.apply
    
  }

  implicit class ErrorOrValSyntax[L <: Throwable, R](either : L \/ R) {
    def ~>?( leftDescription : L => String, rightDescription: R => String ) : DescribedComputation[R] =
      either fold ( l => failure(leftDescription(l)) ~~ l, r => r ~> rightDescription(r))

    def ~>?(description: String): DescribedComputation[R] = ~>?(_ => description, _ => description)
  }

  case class AsyncDescribedComputation[A](run: Future[DescribedComputation[A]]) {
    def flatMap[B](f : A => AsyncDescribedComputation[B])
               (implicit exec: ExecutionContext) : AsyncDescribedComputation[B] =
      AsyncDescribedComputation(
        run.flatMap { dca : DescribedComputation[A] =>
          dca.run.value.fold(
            s => Future.successful( EitherT.left[LogTreeWriter, String, B]( dca.run.map(_ => s) ) ),
            (a : A) => f(a).run.map { x => dca.flatMap { _ => x } } )
        }
      )

    def map[B](f : A => B)(implicit exec: ExecutionContext) : AsyncDescribedComputation[B] =
      AsyncDescribedComputation( run.map { x => x.map { f } } )

  }

  object AsyncDescribedComputation {
    
    def lift[A](computation: DescribedComputation[A]): AsyncDescribedComputation[A] =
      AsyncDescribedComputation( Future.successful(computation))
  }

  implicit val ThrowableShowInstance: Show[Throwable] = Show.show { t => t.getMessage }
}
