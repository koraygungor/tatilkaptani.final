const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// API anahtarlarını global kapsamdan kaldırıyoruz.

const axios = require('axios'); // API çağrıları için

exports.callOpenRouterAI = functions.https.onCall(async (data, context) => {
    // API anahtarını fonksiyonun içinde okuyoruz.
    const openAiApiKey = process.env.OPENROUTER_API_KEY;

    // Güvenlik ve yetkilendirme kontrolleri burada yapılır.
    if (!context.auth) {
        console.error("Cloud Function 'callOpenRouterAI': Kullanıcı kimliği doğrulanmadı.");
        throw new functions.https.HttpsError('unauthenticated', 'Kullanıcı kimliği doğrulanmadı. Lütfen giriş yapın.');
    }

    const prompt = data.prompt;
    const model = data.model || "openai/gpt-3.5-turbo";
    const chatHistory = data.chatHistory || [];

    // API anahtarı kontrolü
    if (!openAiApiKey) {
        console.error("OpenRouter API anahtarı Firebase Functions ortam değişkenlerinde yapılandırılmamış.");
        throw new functions.https.HttpsError('internal', 'AI API anahtarı yapılandırılmamış. Lütfen Firebase Functions ortam değişkenlerini kontrol edin.');
    }

    try {
        const messages = [
            ...(chatHistory.length === 0 && prompt !== null ? [{ role: "system", content: "You are a helpful travel assistant called 'Palmiye Kaptan'." }] : []),
            ...chatHistory,
            ...(prompt !== null ? [{ role: "user", content: prompt }] : []),
        ];

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
    // API anahtarını fonksiyonun içinde okuyoruz.
    const googleGeminiApiKey = process.env.GOOGLE_GEMINI_KEY; // Burayı da güncelledim

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
    const message = data.message;
    if (!message) {
        throw new functions.https.HttpsError('invalid-argument', 'Mesaj boş olamaz.');
    }
    try {
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

// Bu satırı kaldırın, çünkü artık global kapsamda tanımlamaya gerek yok.
// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;