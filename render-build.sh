#!/usr/bin/env bash
set -o errexit

echo ">>> Setting up JDK 21..."

curl -sL -o jdk21.tar.gz "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.2%2B13/OpenJDK21U-jdk_x64_linux_hotspot_21.0.2_13.tar.gz"
mkdir -p target/jdk21
tar -xzf jdk21.tar.gz -C target/jdk21 --strip-components=1
export JAVA_HOME="$PWD/target/jdk21"
export PATH="$JAVA_HOME/bin:$PATH"
java -version
echo ">>> Packaging application using Maven..."
chmod +x mvnw
./mvnw clean package -DskipTests

echo ">>> Build completed successfully."
