// Supabase Configuration
const supabaseUrl = 'https://safymsagxrjymhfdzkph.supabase.co';
const supabaseKey = 'sb_publishable_qthdZZg-tjDRc_loLbVUYg_b77rK-Bv';
const client = window.supabase.createClient(supabaseUrl, supabaseKey);

// ৬টি প্রোডাক্টের সম্পূর্ণ কনফিগারেশন (নাম, দাম ও হিডেন লিংক)
const PRODUCTS_DATA = {
    '1': { 
        name: 'Mega Bundle (All in One)', 
        price: 300, 
        link: 'https://technographybd.xyz/mega-bundle-vip-access.html' 
    },
    '2': { 
        name: 'Facebook & YouTube Growth Course', 
        price: 70, 
        link: 'https://technographybd.xyz/growth-course-access.html' 
    },
    '3': { 
        name: '1.5 Lakh Mixed Mega Reels Bundle', 
        price: 99, 
        link: 'https://technographybd.xyz/reels-bundle-access.html' 
    },
    '4': { 
        name: 'Movie & Drama Clips Collection', 
        price: 99, 
        link: 'https://technographybd.xyz/movie-clips-access.html' 
    },
    '5': { 
        name: 'AI Food & Fitness Videos', 
        price: 50, 
        link: 'https://technographybd.xyz/food-fitness-access.html' 
    },
    '6': { 
        name: 'Islamic Viral Reels Collection', 
        price: 50, 
        link: 'https://technographybd.xyz/islamic-reels-access.html' 
    }
};

// URL থেকে প্রোডাক্ট আইডি সংগ্রহ
const urlParams = new URLSearchParams(window.location.search);
const currentProductKey = urlParams.get('product') || '1';
const CURRENT_PRODUCT = PRODUCTS_DATA[currentProductKey] || PRODUCTS_DATA['1'];
const REQUIRED_AMOUNT = CURRENT_PRODUCT.price;

let selectedMethod = 'bkash';

function toBn(num) {
    const bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return String(num).split('').map(d => bn[d] || d).join('');
}

// পেজ লোড হলে সঠিক টাকার পরিমাণ স্ক্রিনে বসানো
document.addEventListener('DOMContentLoaded', () => {
    const targetAmountEl = document.getElementById('targetAmount');
    if (targetAmountEl) {
        targetAmountEl.innerText = `${toBn(REQUIRED_AMOUNT)} টাকা`;
    }
    const copyAmountBtn = document.getElementById('copyAmountBtn');
    if (copyAmountBtn) {
        copyAmountBtn.setAttribute('onclick', `copyText('${REQUIRED_AMOUNT}', this)`);
    }
    const ruleNotice = document.getElementById('priceNoticeRule');
    if (ruleNotice) {
        ruleNotice.innerHTML = `⚠️ নিয়ম: প্রথমে আপনার একাউন্ট থেকে ওপরের নাম্বারে <span class="text-yellow-400 font-bold">${toBn(REQUIRED_AMOUNT)} টাকা</span> Send Money করুন। এরপর নিচের ফর্মটি পূরণ করুন।`;
    }
});

function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.style.display = 'flex';
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.style.display = 'none';
}

function selectPayment(method) {
    selectedMethod = method;
    const infoBox = document.getElementById('selected-info-box');
    const nameSpan = document.getElementById('active-method-name');
    const logoImg = document.getElementById('active-method-logo');

    if (method === 'bkash') {
        infoBox.className = "bg-pink-950/20 border border-pink-500/30 p-4 sm:p-5 rounded-2xl mb-6 transition-all";
        nameSpan.className = "text-base sm:text-lg font-bold text-pink-400";
        nameSpan.innerText = "বিকাশ (Personal) পেমেন্ট নিয়ম";
        logoImg.src = "https://i.postimg.cc/vm8XHmjc/IMG-20260913-023828.jpg";
    } else if (method === 'nagad') {
        infoBox.className = "bg-orange-950/20 border border-orange-500/30 p-4 sm:p-5 rounded-2xl mb-6 transition-all";
        nameSpan.className = "text-base sm:text-lg font-bold text-orange-400";
        nameSpan.innerText = "নগদ (Personal) পেমেন্ট নিয়ম";
        logoImg.src = "https://i.postimg.cc/mgCyS9x6/IMG-20260913-023227.jpg";
    } else if (method === 'rocket') {
        infoBox.className = "bg-purple-950/20 border border-purple-500/30 p-4 sm:p-5 rounded-2xl mb-6 transition-all";
        nameSpan.className = "text-base sm:text-lg font-bold text-purple-400";
        nameSpan.innerText = "রকেট (Personal) পেমেন্ট নিয়ম";
        logoImg.src = "https://i.postimg.cc/RZKLTtrg/IMG-20260913-023446.jpg";
    }
    closePaymentModal();
}

function copyText(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const span = btnElement.querySelector('span');
        const originalText = span.innerText;
        span.innerText = 'কপি হয়েছে!';
        btnElement.classList.add('bg-emerald-600', 'text-white');
        setTimeout(() => {
            span.innerText = originalText;
            btnElement.classList.remove('bg-emerald-600', 'text-white');
        }, 1500);
    });
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    toastMsg.innerText = message;
    toast.style.backgroundColor = isError ? '#ef4444' : '#10b981';
    toast.className = "show";
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 4500);
}

function resetSubmitBtn(btn) {
    btn.disabled = false;
    btn.innerHTML = '<span>পেমেন্ট কনফার্ম করুন</span> <i class="fa-solid fa-circle-check"></i>';
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const name = document.getElementById('customerName').value.trim();
    let phone = document.getElementById('customerPhone').value.trim();
    const trxId = document.getElementById('trxId').value.replace(/\s+/g, '').toUpperCase();

    if (!name || !phone || !trxId) {
        showToast("সবগুলো তথ্য সঠিকভাবে পূরণ করুন", true);
        return;
    }

    if (phone.startsWith('01')) {
        phone = '88' + phone;
    } else if (phone.startsWith('+88')) {
        phone = phone.replace('+', '');
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> পেমেন্ট যাচাই করা হচ্ছে...';

    try {
        // ১. Supabase থেকে TrxID দিয়ে ডাটা চেক
        const { data: records, error: checkError } = await client
            .from('payments')
            .select('*')
            .ilike('trx_id', trxId);

        if (checkError) {
            showToast("ডাটাবেস কানেকশনে সমস্যা: " + checkError.message, true);
            resetSubmitBtn(submitBtn);
            return;
        }

        if (!records || records.length === 0) {
            showToast("❌ এই TrxID ডাটাবেসে পাওয়া যায়নি! সঠিক TrxID দিন।", true);
            resetSubmitBtn(submitBtn);
            return;
        }

        const paymentRecord = records[0];

        // ২. TrxID ইতিমধ্যে ব্যবহার হয়েছে কি না চেক
        if (paymentRecord.is_used === true) {
            showToast("⚠️ এই TrxID টি ইতিমধ্যেই একবার ব্যবহার করা হয়েছে!", true);
            resetSubmitBtn(submitBtn);
            return;
        }

        // ৩. নির্দিষ্ট প্রোডাক্টের মূল্যের সাথে মিল চেক করা
        const receivedAmount = parseFloat(paymentRecord.amount);

        if (isNaN(receivedAmount) || receivedAmount < REQUIRED_AMOUNT) {
            showToast(`❌ অপর্যাপ্ত পেমেন্ট! প্রোডাক্টের মূল্য ${REQUIRED_AMOUNT} টাকা, কিন্তু পাঠানো হয়েছে ${paymentRecord.amount || 0} টাকা।`, true);
            resetSubmitBtn(submitBtn);
            return;
        }

        // ৪. Supabase-এ স্ট্যাটাস আপডেট
        const { error: updateError } = await client
            .from('payments')
            .update({ 
                is_used: true, 
                whatsapp_number: phone
            })
            .eq('id', paymentRecord.id);

        if (updateError) {
            showToast("❌ সার্ভার সমস্যা: " + updateError.message, true);
            resetSubmitBtn(submitBtn);
            return;
        }

        // ৫. Render-এর পাইথন বটের কাছে ডাইনামিক ডেটা পাঠানো (৪টি প্যারামিটার)
        fetch("https://technography-whatsapp-bot.onrender.com/send-confirmation", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                phone: phone,
                name: name,
                product: CURRENT_PRODUCT.name,
                amount: String(receivedAmount),
                link: CURRENT_PRODUCT.link
            })
        }).catch(e => console.log("Render Bot call error:", e));

        showToast("✅ পেমেন্ট সফল হয়েছে! অ্যাক্সেস পেজে নিয়ে যাওয়া হচ্ছে...");

        // ৬. নির্দিষ্ট প্রোডাক্টের হিডেন অ্যাক্সেস পেজে রিডাইরেক্ট
        setTimeout(() => {
            window.location.href = CURRENT_PRODUCT.link;
        }, 1200);
        
    } catch (err) {
        console.error("Verification System Error:", err);
        showToast("❌ সিস্টেম এরর: " + err.message, true);
        resetSubmitBtn(submitBtn);
    }
}
