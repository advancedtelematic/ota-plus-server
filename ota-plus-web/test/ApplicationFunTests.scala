/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

import java.io.File
import java.sql.SQLSyntaxErrorException

import org.openqa.selenium.By
import org.scalatest.{Tag, BeforeAndAfterAll}
import org.scalatestplus.play._

import scala.collection.JavaConversions._

object BrowserTests extends Tag("BrowserTests")

class ApplicationFunTests extends PlaySpec with OneServerPerSuite with AllBrowsersPerSuite
  with BeforeAndAfterAll {

  override lazy val browsers = Vector(FirefoxInfo(firefoxProfile), ChromeInfo)
  val testVinName = "TESTVVN0123456789"
  val testFilterName = "TestFilter"
  val testFilterExpression = "vin_matches '.*'"
  val testDeleteFilterName = "TestDeleteFilter"
  val testPackageName = "Testpkg"
  val userName = "admin@genivi.org"
  val password = "genivirocks!"

  override lazy val port = app.configuration.getString("test.webserver.port").map(_.toInt).getOrElse(9000)

  override def beforeAll() {
  }

  override def afterAll() {
  }


  def findElementWithText(text: String, selector: String): Boolean = {
    val elems = webDriver.findElements(By.cssSelector(selector))
    var contains = false
    for (n <- elems) if (n.getText.equalsIgnoreCase(text)) contains = true
    contains
  }

  def findElementContainingText(text: String, selector: String): Boolean = {
    val elems = webDriver.findElements(By.cssSelector(selector))
    var contains = false
    for (n <- elems) if (n.getText.contains(text)) contains = true
    contains
  }

  private def buttonFor(displayedText: String): Element = {
    find(xpath(s"""//button[contains(., "$displayedText")]""")).get
  }

  private def closeButton(): Element = buttonFor("Close")

  private def dismissButton(): Element = {
    find(xpath(s"""//button[@data-dismiss='modal']""")).get
  }

  private def anchorTo(target: String): Element = {
    find(xpath(s"""//a[@href='$target']""")).get
  }

  private def fieldNamed(nameAttr: String): TextField = {
    find(xpath(s"""//input[@name='$nameAttr']""")).get.asInstanceOf[TextField]
  }

  // scalastyle:off method.length
  def sharedTests(browser: BrowserInfo) {
    val webHost = app.configuration.getString("test.webserver.host").get
    val webPort = app.configuration.getInt("test.webserver.port").getOrElse(port)
    "All browsers" must {

      "allow users to add and search for vins " + browser.name taggedAs BrowserTests in {
        go to s"http://$webHost:$webPort/"
        eventually {
          click on anchorTo("#/vehicles")
          eventually {
            click on buttonFor("NEW")
            fieldNamed("vin").value = testVinName
            click on buttonFor("Add Vehicle")
            click on closeButton()
            fieldNamed("regex").value = testVinName
            eventually {
              val addedRow = anchorTo(s"#/vehicles/$testVinName")
            }
          }
        }
      }

      "allow users to add packages " + browser.name taggedAs BrowserTests in {
        go to s"http://$webHost:$webPort/"
        eventually {
          click on anchorTo("#/packages")
          click on buttonFor("NEW")
          fieldNamed("name").value = testPackageName
          fieldNamed("version").value = "1.0.0"
          fieldNamed("description").value = "Functional test package"
          fieldNamed("vendor").value = "SOTA"
          val file = new File("./README.md")
          file.exists() mustBe true
          webDriver.findElement(By.name("file")).sendKeys(file.getCanonicalPath)
          click on buttonFor("Add PACKAGE")
          click on dismissButton()
          eventually {
            textField("regex").value = testPackageName
            // TODO findElementWithText(testPackageName, "a") mustBe true
          }
        }
      }

      "allow users to add filters " + browser.name taggedAs BrowserTests in {
        go to s"http://$webHost:$webPort/"
        eventually {
          click on anchorTo("#/filters")
          click on buttonFor("NEW")
          fieldNamed("name").value = testFilterName
          textArea("expression").value = testFilterExpression
          click on buttonFor("Add Filter")
          eventually {
            textField("regex").value = testFilterName
            findElementWithText(testFilterName, "a") mustBe true
          }
        }
      }

      "allow users to create install campaigns " + browser.name taggedAs BrowserTests in {
        go to s"http://$webHost:$webPort/"
        eventually {
          click on anchorTo("#/packages")
          click on linkText(testPackageName)
          click on testFilterName
          click on "new-campaign"
          numberField("priority").value = "1"
          submit()
          eventually {
            findElementContainingText("Update ID:", "span") mustBe true
          }
        }
      }

      "allow users to change filter expressions " + browser.name taggedAs BrowserTests in {
        val alternateFilterExpression = "vin_matches 'TEST'"
        go to s"http://$webHost:$webPort/"
        eventually {
          click on anchorTo("#/filters")
          textField("regex").value = "^" + testFilterName + "$"
          click on anchorTo(s"#/filters/$testFilterName")
          textField("expression").value = alternateFilterExpression
          submit()
          eventually {
            findElementWithText(alternateFilterExpression, "td") mustBe true
          }
        }
      }

      "reject invalid filter expressions " + browser.name taggedAs BrowserTests in {
        val alternateFilterExpression = "invalid"
        go to s"http://$webHost:$webPort/"
        eventually {
          click on anchorTo("#/filters")
          textField("regex").value = "^" + testFilterName + "$"
          click on anchorTo(s"#/filters/$testFilterName")
          textField("expression").value = alternateFilterExpression
          submit()
          eventually {
            // TODO findElementContainingText("Predicate failed:", "div") mustBe true
          }
        }
      }

      "allow users to delete filters " + browser.name taggedAs BrowserTests in {
        go to s"http://$webHost:$webPort/"
        eventually {
          click on anchorTo("#/filters")
          click on buttonFor("NEW")
          textField("name").value = testDeleteFilterName
          textArea("expression").value = testFilterExpression
          submit()
          eventually {
            textField("regex").value = "^" + testDeleteFilterName + "$"
            click on anchorTo(s"#/filters/$testDeleteFilterName")
            click on "delete-filter"
            eventually {
              textField("regex").value = "^" + testDeleteFilterName + "$"
              eventually {
                findElementWithText(testDeleteFilterName, "td") mustBe false
              }
            }
          }
        }
      }
    }
  }
  // scalastyle:on method.length
}
