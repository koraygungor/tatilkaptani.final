const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// OpenAI/Google Gemini API anahtarları ortam değişkenlerinden okunur.
// Bu anahtarları Firebase config set komutuyla ayarlamanız gerekecek:
// firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY" google.gemini_key="YOUR_GOOGLE_GEMINI_API_KEY"
const openAiApiKey = functions.config().openai?.key;
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

    if (!openAiApiKey) {
        console.error("OpenAI API anahtarı Firebase Functions ortam değişkenlerinde yapılandırılmamış.");
        throw new functions.https.HttpsError('internal', 'AI API anahtarı yapılandırılmamış. Lütfen Firebase Functions ortam değişkenlerini kontrol edin.');
    }

    try {
        const messages = [
            { role: "system", content: "You are a helpful travel assistant called 'Palmiye Kaptan'." },
            ...chatHistory,
            { role: "user", content: prompt }
        ];

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
        // Gemini API çağrısını buraya ekleyin. Bu bir yer tutucudur.
        // Örnek: const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${googleGeminiApiKey}`, { contents: [{ parts: [{ text: promptText }] }] }, ...);
        // Şu an için sabit bir placeholder dönüyorum.
        return { imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(promptText)}` };

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
        // Firestore'a okunabilirlik kuralları olduğundan emin olun
        const doc = await firestore.collection('public').doc('adminMessage').get();
        return { message: doc.exists ? doc.data().text : "Henüz yönetici mesajı yok." };
    } catch (error) {
        console.error("Yönetici mesajı alınırken hata:", error);
        throw new functions.https.HttpsError('internal', 'Yönetici mesajı alınamadı.');
    }
});

exports.updateAdminMessage = functions.https.onCall(async (data, context) => {
    // Buraya admin yetkilendirme kontrolü eklenmeli.
    // Örn: if (!context.auth || !context.auth.token.admin) { ... }
    const message = data.message;
    if (!message) {
        throw new functions.https.HttpsError('invalid-argument', 'Mesaj boş olamaz.');
    }
    try {
        await firestore.collection('public').doc('adminMessage').set({ text: message });
        return { message: "Yönetici mesajı başarıyla güncellendi." };
    } catch (error) {
        console.error("Yönetici mesajı güncellenirken hata:", error);
        throw new functions.https.HttpsError('internal', 'Yönetici mesajı güncellenemedi.');
    }
});

exports.sendWelcomeEmail = functions.https.onCall(async (data, context) => {
    const { email, username, subject, message, imageUrl } = data;
    console.log(`Sending welcome email to ${email} for user ${username}`);

    try {
        const simulatedEmailServiceResponse = { success: true, messageId: "simulated-email-id-123" };
        console.log("Simulated email sent:", simulatedEmailServiceResponse);

        let responseMessage = `Hoş geldin e-postası ${email} adresine gönderildi.`;
        let fileUrl = null;
        if (imageUrl) {
            responseMessage += ` Hediye görsel URL'si: ${imageUrl}`;
            fileUrl = imageUrl;
        }
        return { message: responseMessage, fileUrl: fileUrl };

    } catch (error) {
        console.error("Hoş geldin e-postası gönderilirken hata:", error);
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
            fileUrl = await fileRef.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            });
            fileUrl = fileUrl[0];
            console.log("Uploaded file URL:", fileUrl);
        }

        await firestore.collection('contactForms').add({
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