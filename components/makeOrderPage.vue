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
                Оформление заказа
                <span class="title">
                    {{ lengthProducts }} {{ getProductWord(lengthProducts) }}, {{ totalPriceFormatted }} ₸
                </span>
            </div>
            <div class="right">

            </div>
        </header>
        <div class="content">

        </div>
    </div>
</template>
<script setup>
import { h } from 'vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { usePageStore } from '~/store/PagesRoutesStore'
import { useLanguageStore } from '~/store/languagesStore'
import { useMakeProduct } from '~/store/MakeProductStore'
const pagesStore = usePageStore()
const makeProductStore = useMakeProduct()
const languageStore = useLanguageStore()
const lengthProducts = computed(() => {
    return Array.isArray(makeProductStore.products) ? makeProductStore.products.length : 1;
});
const closeMakeOrder = () => {
    pagesStore.goToPage(0);
    makeProductStore.setProducts([]);
    document.body.style.overflow = 'auto';
};
const totalPriceFormatted = computed(() => {
    const products = [makeProductStore.products];

    let total = 0;

    for (const product of products) {
        const priceString = typeof product.price === 'string'
            ? product.price.replace(/\s/g, '')
            : '0';
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
    height: 80px;
    background-color: rgb(255, 255, 255, 0.1);
    display: flex;
    position: fixed;
    top: 0;
    z-index: 999;
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
    height: 80px;
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
    margin-top: 15px;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
    justify-content: center;
    color: var(--foreground);
}

.title {
    font-size: 15px;
    color: var(--graycart-color);
}

.content {
    width: 100%;
    display: flex;
    height: 800px;
}

.container {
    width: 100%;
    min-height: 100dvh;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    transition: all 0.3s ease;
    background-color: var(--background);
}
</style>