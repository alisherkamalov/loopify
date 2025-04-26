<template>
    <div class="container">
        <div class="header">
            <a-tooltip class="btnclose" title="назад" @click="router.push('/')">
                <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
            </a-tooltip>
            <span class="title">Моя корзина</span>
        </div>
        <div class="frame-product" v-for="product in displayedProducts" :key="product.title">
            <div :class="getProductClass(product)" @click="selectProduct(product)">
                <div v-if="focusStore.activeProduct != product" class="product-left">
                    <img :src="product.photoUrl" :alt="product.title" class="product-image">
                    <div class="product-info">
                        <span class="product-name">{{ currentLanguage.devicetype[product.devicetype] }} {{
                            product.name }}</span>
                        <span class="price">{{ product.price }}</span>
                    </div>
                </div>
                <div v-if="focusStore.activeProduct != product" class="product-right">
                    <button class="btn-more">{{ currentLanguage.more }}</button>
                    <button @click.stop="addProductToCart(product)" class="btn-incart">{{ currentLanguage.incart
                        }}</button>
                </div>
                <div v-else class="product-more-info" @click.stop="console.log('product active')">
                    <div class="cont-product">
                        <a-tooltip title="close" @click.stop="closeInfoProduct">
                            <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
                        </a-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { h } from 'vue';
import { CloseOutlined } from '@ant-design/icons-vue';
const router = useRouter()
</script>
<style scoped>
.container {
    width: 100%;
    padding: 25px;
    display: flex;
    flex-direction: column;
}

.title {
    font-size: 30px;
    color: var(--foreground);
}

.header {
    display: flex;
    gap: 15px;
}
</style>