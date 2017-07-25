.PHONY:  clean compile publish test
.DEFAULT_GOAL := publish

SBT := ./sbt
WEBPACK := \
  docker run --rm \
    --volume $(CURDIR)/ota-plus-web/app:/app \
    advancedtelematic/webpack \
		bash -c

clean:
	$(WEBPACK) 'rm -rf assets/css/ assets/js/app.js reactapp/node_modules'
	$(SBT) clean
	
compile:
	$(WEBPACK) 'cd reactapp && npm install && webpack'
	$(SBT) compile

publish: compile
	$(SBT) docker:publish

test: compile
	$(SBT) scalastyle ota-plus-web/ut:test
