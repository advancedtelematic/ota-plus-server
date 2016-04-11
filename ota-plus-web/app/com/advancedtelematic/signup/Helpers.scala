package com.advancedtelematic.signup

import views.html.helper.FieldConstructor

/**
  * Created by vladimir on 05/04/16.
  */
object Helpers {

  implicit val signupField = FieldConstructor(views.html.signupFieldTemplate.f)

}
