# Setup development environment for front-end application

[![N|Solid](https://docs.ota.here.com/_/img/logo.png)](https://docs.ota.here.com/_/img/logo.png)

This documentation will help you to install and setup all the software and tools to run OTA Connect web application. 

This manual was prepared basing on MacOS.

### Installation - MacOS
#### Java

Java 8 (1.8) SE is required.

[Download Java](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html) (you can get Mac OS X x64 jdk-8u261-macosx-x64.dmg)

You can use OpenJDK too.

After installation you can check:
```sh
$ java -version
java version "1.8.0_191"
Java(TM) SE Runtime Environment (build 1.8.0_191-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.191-b12, mixed mode)
```

&nbsp;
####sbt - build tool for Scala

sbt 1.3.9 (higher should work too) is required.

[sbt documentation](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Mac.html)

In MacOS to install sbt you can use brew:
```sh
$ brew install sbt
```

After installation you can check:
```sh
$ sbt sbtVersion
[info] 	1.3.9
```
&nbsp;
####NVM - Node Version Manager

NVM is used for easy switching between installed node.js versions. This is not required for the project setup, but can be helpful.

You can install it by cURL:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
[nvm documentation](https://github.com/nvm-sh/nvm#installing-and-updating)

&nbsp;
####node.js & NPM - Node package manager
node.js 10.x is required.

npm is distributed with Node.js - which means that when you install Node.js, you automatically get npm installed on your computer.

You can [install node.js manually](https://nodejs.org/en/blog/release/v10.18.0/) (you can get macOS 64-bit Installer: https://nodejs.org/dist/v10.18.0/node-v10.18.0.pkg) or use nvm by calling:
```sh
nvm install 10.14.2
nvm ls
nvm use 10.14.2
```

&nbsp;
####kubectl - Kubernetes command-line tool
Here are [kubectl installation instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

After installation you can check:
```sh
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"16+", GitVersion:"v1.16.6-beta.0", GitCommit:"e7f962ba86f4ce7033828210ca3556393c377bcc", GitTreeState:"clean", BuildDate:"2020-01-15T08:26:26Z", GoVersion:"go1.13.5", Compiler:"gc", Platform:"darwin/amd64"}
```


&nbsp;
####kubefwd - Kubernetes port forwarding for local development
kubefwd 1.8.2 (the newest one should be fine too) is required.

Here are [kubefwd installation instructions](https://github.com/txn2/kubefwd)

Ensure you have a context by running:
```sh
kubectl config current-context
```

The install kubefwd by homebrew:
```sh
brew install txn2/tap/kubefwd
```

After installation you can check:
```sh
$ kubefwd 
2020/08/27 10:29:16  _          _           __             _
2020/08/27 10:29:16 | | ___   _| |__   ___ / _|_      ____| |
2020/08/27 10:29:16 | |/ / | | | '_ \ / _ \ |_\ \ /\ / / _  |
2020/08/27 10:29:16 |   <| |_| | |_) |  __/  _|\ V  V / (_| |
2020/08/27 10:29:16 |_|\_\\__,_|_.__/ \___|_|   \_/\_/ \__,_|
2020/08/27 10:29:16 
2020/08/27 10:29:16 Version 1.8.2
2020/08/27 10:29:16 https://github.com/txn2/kubefwd
2020/08/27 10:29:16 
Expose Kubernetes services for local development.
```

&nbsp;
### Configuration - MacOS

####Development hat/stage/environment configuration
You need to get a directory (which is confidential and is used per hat/stage/environment) from other developers.
```sh
fe-dev
```

with following files:
```sh
dev.conf
dev.env
dev-forwarding.sh
dev.env-original
dev.namespace
dev.properties
```

Now put the whole directory in the same directory when you have main project:
```sh
$ ls -a
.
..
fe-dev
ota-plus-server
```

&nbsp;
### Running the application - MacOS

####Installing node.js modules

In the project directory go to:
```sh
ota-plus-server/ota-plus-web/app/reactapp
```

And then type (it should be called only once):
```sh
npm i
```

It will install all the node.js modules (it can take some time).

&nbsp;
####Compiling scala files
There is a need for compile all the scala files.
Go to the main project directory:
```sh
ota-plus-server
```

and type:
```sh
sbt clean compile
```

Some warnings can appear, but this is fine.


&nbsp;
####Running the app - finally

#####You need to be connected to HERE VPN

Now open 3 terminal tabs:

| Tab 1 (kubefwd): |
| ------ |
Go to development hat/stage/environment configuration directory:
```sh
fe-dev
```

and type:
```sh
$ sudo ./dev-forwarding.sh 
```

You should see:
```sh
$ sudo ./dev-forwarding.sh 
Password:
2020/08/28 10:50:39  _          _           __             _
2020/08/28 10:50:39 | | ___   _| |__   ___ / _|_      ____| |
2020/08/28 10:50:39 | |/ / | | | '_ \ / _ \ |_\ \ /\ / / _  |
2020/08/28 10:50:39 |   <| |_| | |_) |  __/  _|\ V  V / (_| |
2020/08/28 10:50:39 |_|\_\\__,_|_.__/ \___|_|   \_/\_/ \__,_|
2020/08/28 10:50:39 
2020/08/28 10:50:39 Version 1.8.2
2020/08/28 10:50:39 https://github.com/txn2/kubefwd
2020/08/28 10:50:39 
2020/08/28 10:50:39 Press [Ctrl-C] to stop forwarding.
2020/08/28 10:50:39 'cat /etc/hosts' to see all host entries.
2020/08/28 10:50:39 Loaded hosts file /etc/hosts
2020/08/28 10:50:39 Hostfile management: Original hosts backup already exists at /Users/cichon.pio/hosts.original
2020/08/28 10:50:40 Forwarding: ingress-nginx:80 to pod nginx-ingress-controller-69c85bff88-mklhn:8080
2020/08/28 10:50:40 Forwarding: ingress-nginx:443 to pod nginx-ingress-controller-69c85bff88-mklhn:8080
2020/08/28 10:50:40 Forwarding: ipaas-tenant-0ad3cc7bd178d053e49792ba3d741f63681530ad-prometheu:80 to pod ipaas-tenant-0ad3cc7bd178d053e49792ba3d741f63681530ad-promkd94c:8080
...
...
2020/08/28 10:50:49 Forwarding: ota-zipkin:80 to pod ota-zipkin-647dbd7b6-fvhfr:9411
2020/08/28 10:50:49 Forwarding: ota-zipkin:9411 to pod ota-zipkin-647dbd7b6-fvhfr:9411
2020/08/28 10:50:49 Forwarding: tiller-deploy:44134 to pod tiller-deploy-74d597fb44-mpbrw:44134
```

&nbsp;

| Tab 2 (sbt): |
| ------ |
Go to the main project directory:
```sh
ota-plus-server
```

and type:
```sh
source ../fe-dev/dev.env && sbt -Dhttp.port=9442 -Dhttps.port=9443 ota-plus-web/run
```

You should see:
```sh
[info] Loading settings for project ota-plus-server-build from plugins.sbt ...
[info] Loading project definition from /Users/cichon.pio/Documents/workspace/ATS-OTA/ota-plus-server/project
[info] Loading settings for project ota-plus-web from build.sbt ...
[info] Loading settings for project ota-plus-server from build.sbt ...
[info] Set current project to ota-plus-server (in build file:/Users/cichon.pio/Documents/workspace/ATS-OTA/ota-plus-server/)
[WARN] [08/28/2020 11:14:24.310] [main] [ManifestInfo(akka://sbt-web)] Detected possible incompatible versions on the classpath. Please note that a given Akka version MUST be the same across all modules of Akka that you are using, e.g. if you use [2.5.17] all other modules that are released together MUST be of the same version. Make sure you're using a compatible set of libraries.Possibly conflicting versions [2.5.4, 2.5.17] in libraries [akka-persistence:2.5.4, akka-protobuf:2.5.4, akka-actor:2.5.17, akka-remote:2.5.4, akka-cluster:2.5.4, akka-stream:2.5.4, akka-cluster-tools:2.5.4]

--- (Running the application, auto-reloading is enabled) ---

[WARN] [08/28/2020 11:14:43.986] [pool-10-thread-5] [ManifestInfo(akka://play-dev-mode)] Detected possible incompatible versions on the classpath. Please note that a given Akka version MUST be the same across all modules of Akka that you are using, e.g. if you use [2.5.30] all other modules that are released together MUST be of the same version. Make sure you're using a compatible set of libraries. Possibly conflicting versions [2.5.30, 2.5.26] in libraries [akka-protobuf:2.5.30, akka-actor:2.5.30, akka-slf4j:2.5.26, akka-stream:2.5.30]
[info] p.c.s.NettyServer - Listening for HTTP on /0:0:0:0:0:0:0:0:9442
[info] p.c.s.NettyServer - Listening for HTTPS on /0:0:0:0:0:0:0:0:9443

(Server started, use Enter to stop and go back to the console...)
```

&nbsp;

| Tab 3 (webpack): |
| ------ |

Go to  directory:
```sh
ota-plus-server/ota-plus-web/app/reactapp
```

and type:
```sh
npm run dev
```

You should see:
```sh
$ npm run dev

>  ./node_modules/webpack/bin/webpack.js -w

webpack is watching the files…

Hash: ba251a0bbaa7458f8c71
Version: webpack 4.30.0
Time: 21789ms
Built at: 2020-08-28 11:48:40
                     Asset      Size  Chunks             Chunk Names
          ../css/style.css  1.75 MiB          [emitted]  
       ../css/unlogged.css   153 KiB          [emitted]  
                    app.js  11.3 MiB    main  [emitted]  main
otaconnectsourcemap.js.map  10.6 MiB    main  [emitted]  main
Entrypoint main = app.js otaconnectsourcemap.js.map
[0] multi ./src/main.jsx ./style/style.scss ./style/unlogged.scss 52 bytes {main} [built]
[./src/Routes.jsx] 3.82 KiB {main} [built]
[./src/config.js] 19.2 KiB {main} [built]
[./src/constants/locationConstants.js] 388 bytes {main} [built]
[./src/helpers/languageHelper.js] 813 bytes {main} [built]
[./src/i18n.js] 1.77 KiB {main} [built]
[./src/layouts/Main.jsx] 15.5 KiB {main} [built]
[./src/main.jsx] 849 bytes {main} [built]
[./src/partials/Footer/index.jsx] 5.5 KiB {main} [built]
[./src/partials/Navbar/index.jsx] 4.27 KiB {main} [built]
[./src/partials/SubNavBar/index.jsx] 3.93 KiB {main} [built]
[./src/stores/CampaignsStore.js] 28.9 KiB {main} [built]
[./src/stores/index.js] 986 bytes {main} [built]
[./style/style.scss] 32 bytes {main} [built]
[./style/unlogged.scss] 35 bytes {main} [built]
    + 1738 hidden modules
```

If you are experiencing bindings error:
```sh
Error: Missing binding 
```

run ```npm rebuild node-sass``` to download the binding for your current environment.


&nbsp;

#####Now open web browser and type the url:
```sh
https://localhost:9443/
```
