import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";
import { languages } from "~/lib/languages";
import { setAndDispatch } from '@/utils/storageSync'

export const useLanguageStore = defineStore("language", () => {
  const languageCode = ref("ru");

  // Загрузка значения из localStorage только в браузере
  onMounted(() => {
    const stored = localStorage.getItem("languageCode");
    if (stored) {
      languageCode.value = stored;
    }

    // Слушаем изменения в localStorage
    window.addEventListener("storage", (event) => {
      if (event.key === "languageCode") {
        languageCode.value = event.newValue || "ru";
      }
    });
  });

  const currentLanguage = computed(() => {
    return languages[languageCode.value] || languages.ru;
  });

  function setLanguage(code) {
    languageCode.value = code;
    if (typeof localStorage !== "undefined") {
      setAndDispatch("languageCode", code);
    }
  }

  return {
    languageCode,
    currentLanguage,
    setLanguage,
  };
});
