import Page from "../modules/Page/model";

function createPage() {
  Page.create({
    about: {
      en: "about",
      ar: "عن التطبيق",
    },
    privacy: {
      en: "Privacy",
      ar: "سياسة الخصوصية",
    },
    conditions: {
      en: "Condetions and terms",
      ar: "شروط الاستخدام",
    },
  }).then(() => console.log("Page has been created"));
}

createPage();
