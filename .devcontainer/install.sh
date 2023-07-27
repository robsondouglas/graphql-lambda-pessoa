echo INSTALANDO JAVA...
apt update 
apt install default-jdk -y 
apt install default-jre -y
clear 

echo INSTALANDO AWS CLI...
mkdir _aws 
cd _aws 
curl https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o awscliv2.zip 
unzip awscliv2.zip 
./aws/install 
cd .. 
rm _aws -rf 
apt install less -y
clear

clear
echo INSTALANDO NPM....
npm i

clear
echo INSTALANDO SLS CLI....
npm i serverless -g
clear

echo INSTALANDO MONGOSH
curl -O https://downloads.mongodb.com/compass/mongodb-mongosh_1.10.0_amd64.deb 
apt install ./mongodb-mongosh_1.10.0_amd64.deb 
rm ./mongodb-mongosh_1.10.0_amd64.deb
clear

echo INSTALAÇÃO CONCLUÍDA!