<template>
    <div class="container">
        <span class="title">
            <span class="textlogo">LOOPIFY</span>
        </span>
        <span class="authtext">Подтверждение личности</span>
        <button @click="authenticate">Подтвердить</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useIslandStore } from '~/store/IslandStore';
import { useLanguageStore } from '~/store/languagesStore';
import { usePageStore } from '~/store/PagesRoutesStore';
const authenticated = ref(false);
const dynamicIsland = useIslandStore();
const languageStore = useLanguageStore();
const token = ref('')
const pagesStore = usePageStore()
onMounted(() => {
    document.body.style.overflow = 'hidden';
    dynamicIsland.deactivateIsland();
    if (localStorage.getItem('username')) {
        authenticate()
    }
});

async function authenticate() {

    if (!window.PublicKeyCredential) {
        alert('WebAuthn не поддерживается этим браузером');
        return;
    }
    localStorage.removeItem('authenticated')
    const publicKey = {
        challenge: Uint8Array.from('simple-challenge', c => c.charCodeAt(0)),
        rp: { name: 'Loopify' },
        user: {
            id: Uint8Array.from('user-id', c => c.charCodeAt(0)),
            name: localStorage.getItem('useremail') || 'Loopify User',
            displayName: localStorage.getItem('username') || 'Loopify User'
        },
        pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 }
        ],
        authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
        },
        timeout: 60000,
        attestation: 'none'
    };


    try {
        dynamicIsland.deactivateIsland();
        const credential = await navigator.credentials.create({ publicKey });
        console.log('Успешная проверка:', credential);
        localStorage.setItem('authenticated', 'true');
        authenticated.value = true;
        dynamicIsland.setAuth(true);
        token.value = localStorage.getItem('token')
        if (token.value) {
            axios.get('https://backendlopify.vercel.app/me', {
                headers: { Authorization: `Bearer ${token.value}` }
            })
                .then(response => {
                    localStorage.setItem('userid', response.data._id)
                    localStorage.setItem('username', response.data.nickname)
                    localStorage.setItem('useremail', response.data.email)
                })
                .catch(error => {
                    console.error('Ошибка запроса /me:', error);
                    token.value = null;
                    pagesStore.goToPage(0)
                    return
                })
                .finally(() => {
                    setTimeout(() => isLoading.value = false, 1000);
                })
        }
        setTimeout(() => {
            pagesStore.goToPage(1);
            document.body.style.overflow = 'auto';
        }, 500);

    } catch (err) {
        dynamicIsland.deactivateIsland();
        if (localStorage.getItem('authenticated') === 'true') {
            authenticated.value = true;
            dynamicIsland.setAuth(true);
            setTimeout(() => {
                pagesStore.goToPage(1);
                document.body.style.overflow = 'auto';
            }, 500);
            return;
        }
        console.error('Ошибка биометрии:', err);
    }
}
</script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
}

.title {
    font-size: 40px;
    margin-top: 200px;
}

.textlogo {
    font-family: 'Bernoru';
}

.authtext {
    font-size: 20px;
    margin-bottom: 50px;
}

button {
    width: 200px;
    height: 50px;
    border-radius: 25px;
    background-color: var(--background);
    border: 1px solid var(--border-color);
    color: var(--foreground);
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background-color: var(--foreground);
    color: var(--background);
}
</style>