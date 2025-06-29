const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// OpenAI/Google Gemini API anahtarları ortam değişkenlerinden okunur.
// Bu anahtarları Firebase config set komutuyla ayarlamanız gerekecek:
// firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY" google.gemini_key="YOUR_GOOGLE_GEMINI_API_KEY"
const openAiApiKey = functions.config().openrouter?.key; // openrouter.key olarak düzeltildi
const googleGeminiApiKey = functions.config().google?.gemini_key;
    
const axios = require('axios'); // API çağrıları için

exports.callOpenRouterAI = functions.https.onCall(async (data, context) => {
    // Güvenlik ve yetkilendirme kontrolleri burada yapılır.
    if (!context.auth) {
        console.error("Cloud Function 'callOpenRouterAI': Kullanıcı kimliği doğrulanmadı.");
        throw new functions.https.HttpsError('unauthenticated', 'Kullanıcı kimliği doğrulanmadı. Lütfen giriş yapın.');
    }

    const prompt = data.prompt;
    const model = data.model || "openai/gpt-3.5-turbo";
    const chatHistory = data.chatHistory || [];

    // openAiApiKey yerine openrouter.key olarak düzeltildi
    // API anahtarı kontrolü buraya eklendi/düzeltildi
    if (!openAiApiKey) {
        console.error("OpenRouter API anahtarı Firebase Functions ortam değişkenlerinde yapılandırılmamış.");
        // Hata fırlatma satırı düzeltildi
        throw new functions.https.HttpsError('internal', 'AI API anahtarı yapılandırılmamış. Lütfen Firebase Functions ortam değişkenlerini kontrol edin.');
    }

    try {
        const messages = [
            // Eğer `prompt` boşsa ve sadece `chatHistory` gönderiliyorsa, ilk eleman olarak sistem mesajını ekle
            // Aksi takdirde, sistem mesajını sadece chat geçmişi boşsa ekle
            ...(chatHistory.length === 0 && prompt !== null ? [{ role: "system", content: "You are a helpful travel assistant called 'Palmiye Kaptan'." }] : []),
            ...chatHistory,
            // Eğer prompt null değilse veya boş değilse, bir kullanıcı mesajı olarak ekle
            ...(prompt !== null ? [{ role: "user", content: prompt }] : []),
        ];

        // API'ye boş mesaj dizisi göndermemek için kontrol
        if (messages.length === 0) {
            throw new functions.https.HttpsError('invalid-argument', 'AI için mesaj sağlanmadı.');
        }

        const response = await axios.post(
            `https://openrouter.ai/api/v1/chat/completions`,
            {
                model: model,
                messages: messages,
            },
            {
                headers: {
                    'Authorization': `Bearer ${openAiApiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return { reply: response.data.choices[0].message.content };
    } catch (error) {
        console.error("OpenRouter AI çağrılırken hata:", error.response?.data?.message || error.message);
        let errorMessage = `AI iletişim hatası: ${error.response?.data?.message || error.message}`;
        if (error.response && error.response.status) {
            errorMessage = `AI hizmetinden hata kodu ${error.response.status}: ${error.response.statusText}. Detay: ${error.response.data?.message || 'Bilinmeyen Hata'}`;
        }
        throw new functions.https.HttpsError('internal', errorMessage);
    }
});

exports.callImageGenerationAI = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        console.error("Cloud Function 'callImageGenerationAI': Kullanıcı kimliği doğrulanmadı.");
        throw new functions.https.HttpsError('unauthenticated', 'Kullanıcı kimliği doğrulanmadı.');
    }
    const promptText = data.promptText;

    if (!googleGeminiApiKey) {
        console.error("Google Gemini API anahtarı Firebase Functions ortam değişkenlerinde yapılandırılmamış.");
        throw new functions.https.HttpsError('internal', 'Google Gemini API anahtarı yapılandırılmamış. Lütfen Firebase Functions ortam değişkenlerini kontrol edin.');
    }

    try {
        // BURASI ÇOK ÖNEMLİ! Bu kısım hala bir yer tutucudur.
        // Google Gemini API'sinin gerçek görsel oluşturma (Vision) özelliğini burada entegre etmelisiniz.
        // Genellikle Gemini, görseli Base64 formatında döndürür.
        // Eğer Base64 dönerse, bu veriyi Firebase Storage'a yükleyip ardından bir URL döndürmeniz gerekir.
        // Şimdilik, sadece bir placeholder (geçici) URL dönüyorum.
        
        // Örnek: Eğer Google Gemini API'sini kullanmak için @google/generative-ai paketini yüklediyseniz:
        // const { GoogleGenerativeAI } = require('@google/generative-ai');
        // const genAI = new GoogleGenerativeAI(googleGeminiApiKey);
        // const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" }); // VEYA uygun görsel modeli

        // const result = await model.generateContent([promptText]);
        // const response = result.response;
        // const imageBase64 = response.candidates[0].content.parts[0].inlineData.data; // Örnek Base64 yolu

        // const bucket = admin.storage().bucket();
        // const fileName = `generated_images/${Date.now()}_${context.auth.uid}.png`; // Kullanıcı ID'si ve zaman ile benzersiz isim
        // const fileRef = bucket.file(fileName);
        // await fileRef.save(Buffer.from(imageBase64, 'base64'), {
        //     metadata: { contentType: 'image/png' }, // veya uygun tür
        //     resumable: false
        // });
        // const imageUrl = (await fileRef.getSignedUrl({ action: 'read', expires: '03-09-2491' }))[0];

        // return { imageUrl: imageUrl };

        // Şimdilik sadece test amaçlı bir placeholder URL dönüyoruz:
        return { imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(promptText.substring(0, 30))}` };

    } catch (error) {
        console.error("Google Gemini Image Generation çağrılırken hata:", error.response?.data?.message || error.message);
        let errorMessage = `Görsel AI hatası: ${error.response?.data?.message || error.message}`;
        if (error.response && error.response.status) {
            errorMessage = `Görsel AI hizmetinden hata kodu ${error.response.status}: ${error.response.statusText}. Detay: ${error.response.data?.message || 'Bilinmeyen Hata'}`;
        }
        throw new functions.https.HttpsError('internal', errorMessage);
    }
});

exports.getAdminMessage = functions.https.onCall(async (data, context) => {
    try {
        // Güvenlik: Bu veriyi herkese açık Firestore'dan okuyacağımız için,
        // Firestore Güvenlik Kuralları'nda (Firestore Security Rules)
        // public/data/admin/message dokümanına okuma izni verdiğinizden emin olun.
        const doc = await admin.firestore().collection('public').doc('data').collection('admin').doc("message").get();
        return { message: doc.exists ? doc.data().message : "Henüz yönetici mesajı yok." };
    } catch (error) {
        console.error("Yönetici mesajı alınırken hata:", error);
        throw new functions.https.HttpsError('internal', 'Yönetici mesajı alınamadı.');
    }
});

exports.updateAdminMessage = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Bu işlemi yapmak için giriş yapmalısınız.');
    }
    // NOT: Gerçek bir uygulamada, kullanıcının yönetici yetkisine sahip olup olmadığını da kontrol etmelisiniz.
    // Örn: if (!context.auth.token.admin) { ... } // Custom claims ile admin kontrolü
    const message = data.message;
    if (!message) {
        throw new functions.https.HttpsError('invalid-argument', 'Mesaj boş olamaz.');
    }
    try {
        // Güvenlik: Bu veriyi Firestore'a yazmak için,
        // Firestore Güvenlik Kuralları'nda (Firestore Security Rules)
        // sadece yetkili kullanıcılara (örn. admin) yazma izni verdiğinizden emin olun.
        await admin.firestore().collection('public').doc('data').collection('admin').doc("message").set({ message: message });
        return { message: "Yönetici mesajı başarıyla güncellendi." };
    } catch (error) {
        console.error("Yönetici mesajı güncellenirken hata:", error);
        throw new functions.https.HttpsError('internal', 'Yönetici mesajı güncellenemedi.');
    }
});

exports.sendWelcomeEmail = functions.https.onCall(async (data, context) => {
    const { email, username, subject, message, imageUrl } = data;
    console.log(`Sending email to ${email} for user ${username} with subject: ${subject || "Welcome"}`);

    try {
        // Bu kısım gerçek bir e-posta gönderme servisi (SendGrid, Nodemailer, vb.) ile entegre edilmelidir.
        // Şu an sadece simüle edilmiş bir yanıt dönüyor.
        const simulatedEmailServiceResponse = { success: true, messageId: "simulated-email-id-123" };
        console.log("Simulated email sent:", simulatedEmailServiceResponse);

        let responseMessage = `E-posta ${email} adresine gönderildi (simülasyon).`;
        let fileUrl = null;
        if (imageUrl) {
            responseMessage += ` Ekli görsel URL'si: ${imageUrl}`;
            fileUrl = imageUrl;
        }
        return { message: responseMessage, fileUrl: fileUrl };

    } catch (error) {
        console.error("E-posta gönderilirken hata:", error);
        throw new functions.https.HttpsError('internal', `E-posta gönderilirken bir sorun oluştu: ${error.message}`);
    }
});

exports.submitContactForm = functions.https.onCall(async (data, context) => {
    const { subject, email, message, fileName, fileType, fileData } = data;
    console.log(`Contact form submitted from ${email} with subject: ${subject}`);

    let fileUrl = null;
    try {
        if (fileName && fileData) {
            const bucket = admin.storage().bucket();
            const fileRef = bucket.file(`contact_uploads/${Date.now()}_${fileName}`);
            const buffer = Buffer.from(fileData, 'base64');
            await fileRef.save(buffer, {
                metadata: { contentType: fileType },
                resumable: false
            });
            fileUrl = (await fileRef.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            }))[0];
            console.log("Uploaded file URL:", fileUrl);
        }

        await admin.firestore().collection('contactForms').add({
            subject,
            email,
            message,
            fileName: fileName || null,
            fileType: fileType || null,
            fileUrl: fileUrl || null,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return { message: "Mesajınız başarıyla alındı ve kaydedildi!", fileUrl: fileUrl };
    } catch (error) {
        console.error("İletişim formu işlenirken hata:", error);
        throw new functions.https.HttpsError('internal', `İletişim formunuz gönderilirken bir sorun oluştu: ${error.message}`);
    }
});