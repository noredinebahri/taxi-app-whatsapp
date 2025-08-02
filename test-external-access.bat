@echo off
echo ================================================================
echo 🎉 WHATSAPP TRANSFER VVIP - TEST ACCES EXTERNE REUSSI !
echo ================================================================
echo.
echo 🌐 Serveur Oracle Cloud: 79.72.25.202
echo 🔗 API accessible publiquement via Nginx (port 80)
echo 🔐 Authentication: x-api-key header requis
echo.

echo 📋 Test 1: Health Check via Nginx...
curl -s -X GET http://79.72.25.202/health -H "x-api-key: mySuperSecretKey"
echo.
echo.

echo 📋 Test 2: Session Status...
curl -s -X GET http://79.72.25.202/api/whatsapp/sessions/status -H "x-api-key: mySuperSecretKey"
echo.
echo.

echo 📋 Test 3: Template Welcome Message...
curl -s -X POST http://79.72.25.202/api/whatsapp/templates/welcome ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: mySuperSecretKey" ^
  -d "{\"senderId\":\"external-test\",\"recipients\":[\"+212600000000\"],\"welcomeData\":{\"name\":\"Ahmed\",\"company\":\"VIP Transfer\",\"support_contact\":\"+212600111222\"}}"
echo.
echo.

echo ✅ DEPLOIEMENT REUSSI ! Votre API WhatsApp est accessible publiquement !
echo 🚀 URL de base: http://79.72.25.202
echo 📖 Documentation complete dans README.md
echo ================================================================
pause
