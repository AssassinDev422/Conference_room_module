NodeJS-Conference-Room Module
========================
##
## by AssassinDev422 (saas.exp7@gmail.com)
##
## 1. Install [Node.js](http://www.nodejs.org)
## 2. Install dependancies (npm install)
## 3. Run Node server (node app.js) vith sudo
## 4. Rest Call for schedule: https://[YOUR_IP]:843/conferenceData
## conferenceObj (x-www-form-urlencoded)
## {"conferenceRoomId":"aabe7c12561b457eac3351e29c2380e2","conferenceSecret":"d7b5ef7787d841b59a7940ab9ca6b5d9","conductor":{"id":"kavi","conductorToken":"1435f0549f2c4b4a95f36e5e82f3bd46"},"slidesUploaded":false,"conductorEntered":false,"conductees":{"duminda":{"uid":"duminda","conducteeToken":"eee458fc0e164cb5af7978eb5c5af0c1"}}}
## cancel schedul and clear data: https://[YOUR_IP]:843/cancelSchedule

##You can generate the privatekey.pem and certificate.pem files using the following commands:
# openssl genrsa -out privatekey.pem 1024 
# openssl req -new -key privatekey.pem -out certrequest.csr 
# openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
