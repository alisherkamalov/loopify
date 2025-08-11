<template>
    <div class="container">
        <header>
            <div class="left">
                <a-tooltip class="btnclose">
                    <a-button color="black" class="btnclose" @click="closeMakeOrder" shape="circle"
                        :title="languageStore.currentLanguage.back" :icon="h(ArrowLeftOutlined)" />
                </a-tooltip>
            </div>
            <div class="info">
                {{ languageStore.currentLanguage.makeinorderr }}
                <span class="title">
                    {{ lengthProducts }} {{ getProductWord(lengthProducts) }}, {{ totalPriceFormatted }} ₸
                </span>
            </div>
            <div class="right">

            </div>
        </header>
        <div class="center-content">
            <div class="content">
                <div class="left-info">
                    <div class="place-order">
                        <span class="title">
                            {{ languageStore.currentLanguage.makeinorderr }}
                        </span>
                        <span class="quantity-product">
                            {{ lengthProducts }} {{ getProductWord(lengthProducts) }}
                        </span>
                        <div class="info-product">

                        </div>
                    </div>
                </div>
                <div class="right-info">
                    <div class="payment-cont">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { h } from 'vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { useProductPageStore } from '~/store/ProductPageStore'
import { useLanguageStore } from '~/store/languagesStore'
import { useMakeProduct } from '~/store/MakeProductStore'
import { useRegistrationProductsStore } from '~/store/registrationProductsStore'
import { useHomePageStore } from '~/store/HomePageStore'
import { useSheetStore } from '~/store/sheetStore'
const pagesStore = useProductPageStore()
const makeProductStore = useMakeProduct()
const homeStore = useHomePageStore()
const bottomsheetStore = useSheetStore()
const registrationProducts = useRegistrationProductsStore()
const languageStore = useLanguageStore()
const lengthProducts = computed(() => {
    return Array.isArray(makeProductStore.products) ? makeProductStore.products.length : 1;
});
const closeMakeOrder = () => {
    if (registrationProducts.isRegistration) {
        homeStore.setOpen(false)
        setTimeout(() => {
            bottomsheetStore.open()
        }, 300);
        return
    }
    pagesStore.setOpen(false)
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        makeProductStore.setProducts([]);
    }, 300);
};
const totalPriceFormatted = computed(() => {
    const products = Array.isArray(makeProductStore.products)
        ? makeProductStore.products
        : [makeProductStore.products];

    let total = 0;

    for (const product of products) {
        const rawPrice = product.price ?? product.productId?.price ?? 0
        const priceString = typeof rawPrice === 'string'
            ? rawPrice.replace(/\s/g, '')
            : String(rawPrice || '0')

        const price = parseInt(priceString, 10);
        if (!isNaN(price)) {
            total += price;
        }
    }

    return total.toLocaleString('ru-RU');
});





const getProductWord = (count) => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 14) return languageStore.currentLanguage.cartthree;
    if (mod10 === 1) return languageStore.currentLanguage.cartone;
    if (mod10 >= 2 && mod10 <= 4) return languageStore.currentLanguage.carttwo;
    return languageStore.currentLanguage.cartthree;
};

</script>
<style scoped>
header {
    width: 100%;
    background-color: rgb(255, 255, 255, 0.1);
    display: flex;
    position: fixed;
    top: 0;
    z-index: 9998;
    padding-top: env(safe-area-inset-top);
    backdrop-filter: blur(15px);
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #8a8a9e;
}

.left {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 15px;
    translate: 0px 1px;
}

.left-info {
    width: 60%;
    overflow-x: hidden;
    display: flex;
    align-items: end;
    flex-direction: column;
}

.place-order {
    width: 95%;
    display: flex;
    border-radius: 20px;
    padding: 20px;
    gap: 10px;
    border: 1px solid transparent;
    flex-direction: column;
    min-height: 290px;
    background-color: var(--background);
}

.place-order>.title {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--foreground);
}

.place-order>.quantity-product {
    color: var(--graycart-color);
    font-weight: 500;
}

.place-order>.info-product {
    width: 100%;
    display: flex;
}

.payment-cont {
    width: 360px;
    display: flex;
    border-radius: 20px;
    border: 1px solid transparent;
    height: 270px;
    background-color: var(--background);
}

.right-info {
    width: 40%;
    overflow-x: hidden;
    display: flex;
    justify-content: center;
}

.btnclose {
    background-color: transparent;
}

.right {
    display: flex;
    align-items: center;
    width: 32px;
    justify-content: center;
    margin-right: 15px;
}

.info {
    display: flex;
    margin-top: 25px;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
    margin-bottom: 15px;
    justify-content: center;
    color: var(--foreground);
}

.box {
    width: 100%;
    display: flex;
    height: 1500px;
}

.title {
    font-size: 15px;
    color: var(--graycart-color);
}

.content {
    width: 100%;
    max-width: 1300px;
    display: flex;
    height: 800px;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 20px;
    margin-top: calc(env(safe-area-inset-top) + 87.5px);
}

.center-content {
    width: 100%;
    display: flex;
    min-height: 100dvh;
    background-color: var(--cartbasket-color);
    justify-content: center;
}

.container {
    width: 100%;
    display: flex;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 999;
    flex-direction: column;
    transition: all 0.3s ease;
    background-color: var(--background);
}

@media (max-width: 1160px) {
    .content {
        flex-direction: column;
        gap: 20px;
    }

    .left-info {
        width: 100%;
        align-items: center;
    }

    .right-info {
        width: 100%;
    }

    .payment-cont {
        width: 95%;
    }
}
</style>