name := "chat"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  javaJdbc,
  javaEbean,
  cache
)   

libraryDependencies += "org.codehaus.jackson" % "jackson-core-asl" % "1.9.0"
 
libraryDependencies += "com.google.code.gson" % "gson" % "2.6.2"

libraryDependencies += "org.json"%"org.json"%"chargebee-1.0" 

play.Project.playJavaSettings
