export type GradeLevel = '5' | '6' | '7' | '8';

export interface StudentAccount {
  id: string;
  username: string;
  password: string;
  registeredAt: string;
}

export interface AnnualPlanWeekRow {
  id: string;
  term: '1. Dönem' | '2. Dönem';
  weeks: string;
  month: string;
  hours: string;
  themeOrUnit: string;
  learningOutcomeCode: string;
  topicAndOutcome: string;
  assessmentAndNotes: string;
}

export interface TeacherLinkItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  type: 'plan' | 'attendance' | 'note-link' | 'portal';
  grade?: GradeLevel | 'Genel';
  updatedAt: string;
  sharedWithStudents?: boolean;
}

export interface LeftSidebarCategory {
  id: string;
  title: string;
  description: string;
  teacherOnly?: boolean;
  items: TeacherLinkItem[];
}

export interface TeacherNote {
  id: string;
  title: string;
  content: string;
  url?: string;
  category: 'Genel' | '5. Sınıf' | '6. Sınıf' | '7. Sınıf' | '8. Sınıf' | 'Toplantı & İdare';
  createdAt: string;
  pinned: boolean;
  sharedWithStudents: boolean;
}

export interface GradeContentItem {
  id: string;
  grade: GradeLevel;
  unitNumber: string;
  title: string;
  type: 'Konu Anlatımı' | 'Çalışma Yaprağı' | 'Sınav & Deneme' | 'İnteraktif Etkinlik';
  weekRange: string;
  summary: string;
  url: string;
  sourceLabel?: string;
}

export interface ExternalGameLink {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  recommendedGrade: string;
}

export interface DuelQuestion {
  id: string;
  grade: GradeLevel | 'Genel';
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  points: number;
}

export interface StudentAttendanceRecord {
  id: string;
  number: string;
  name: string;
  status: 'Var' | 'Yok' | 'İzinli';
}

export const INITIAL_ANNUAL_PLANS: Record<string, AnnualPlanWeekRow[]> = {
  'plan-5': [
    {
      id: 'p5-1',
      term: '1. Dönem',
      weeks: '1–3. Hafta',
      month: 'Eylül',
      hours: '15 Saat',
      themeOrUnit: '1. Tema: Geometrik Şekiller',
      learningOutcomeCode: 'MAT.5.3.1 – MAT.5.3.2',
      topicAndOutcome: 'Temel geometrik çizimler (nokta, doğru, doğru parçası, ışın) için matematiksel araç ve teknoloji kullanımı; dikme ve paralel doğru inşası.',
      assessmentAndNotes: 'İzleme Testi · Pergel ve cetvel etkinlikleri · İlköğretim Haftası',
    },
    {
      id: 'p5-2',
      term: '1. Dönem',
      weeks: '4–6. Hafta',
      month: 'Ekim',
      hours: '15 Saat',
      themeOrUnit: '1. Tema: Geometrik Şekiller',
      learningOutcomeCode: 'MAT.5.3.3 – MAT.5.3.5',
      topicAndOutcome: 'Açıları ölçmek için matematiksel araç kullanımı; düzlemde iki veya üç doğrunun birbirine göre durumları ve oluşan açılar; çokgenlerin özellikleri.',
      assessmentAndNotes: 'Açık Uçlu Çalışma Yaprağı · 29 Ekim Cumhuriyet Bayramı',
    },
    {
      id: 'p5-3',
      term: '1. Dönem',
      weeks: '7–9. Hafta',
      month: 'Ekim – Kasım',
      hours: '15 Saat',
      themeOrUnit: '1. Tema: Geometrik Şekiller & 2. Tema: Sayılar ve Nicelikler (1)',
      learningOutcomeCode: 'MAT.5.3.6 – MAT.5.1.1',
      topicAndOutcome: 'Çemberde merkez, yarıçap ve çap kavramları; 6 basamaklıdan çok basamaklıya kadar doğal sayıların okunuşu, bölük ve basamak değerleri.',
      assessmentAndNotes: '1. Dönem 1. Ortak Yazılı Sınavı · 10 Kasım Atatürk’ü Anma',
    },
    {
      id: 'p5-4',
      term: '1. Dönem',
      weeks: '10–13. Hafta',
      month: 'Kasım – Aralık',
      hours: '20 Saat',
      themeOrUnit: '2. Tema: Sayılar ve Nicelikler (1)',
      learningOutcomeCode: 'MAT.5.1.2',
      topicAndOutcome: 'Doğal sayılarla dört işlem içeren gerçek yaşam problemlerini çözebilme; zihinden işlem ve sonuç tahmin stratejileri.',
      assessmentAndNotes: 'Problem Çözme Performans Görevi · 24 Kasım Öğretmenler Günü',
    },
    {
      id: 'p5-5',
      term: '1. Dönem',
      weeks: '14–18. Hafta',
      month: 'Aralık – Ocak',
      hours: '25 Saat',
      themeOrUnit: '3. Tema: Geometrik Nicelikler',
      learningOutcomeCode: 'MAT.5.4.1 – MAT.5.4.4',
      topicAndOutcome: 'Kenar uzunlukları doğal sayı olan dikdörtgenin çevre uzunluğu ve alanı; birim karelerle alan tahmini; çevre ve alan arasındaki ilişkiyi yorumlama.',
      assessmentAndNotes: '1. Dönem 2. Ortak Yazılı Sınavı · Dönem Sonu Değerlendirme',
    },
    {
      id: 'p5-6',
      term: '2. Dönem',
      weeks: '19–24. Hafta',
      month: 'Şubat – Mart',
      hours: '30 Saat',
      themeOrUnit: '2. Tema: Sayılar ve Nicelikler (2) – Kesirler',
      learningOutcomeCode: 'MAT.5.1.3 – MAT.5.1.5',
      topicAndOutcome: 'Gerçek yaşam durumlarına karşılık gelen kesirleri farklı biçimlerde (birim kesir, bileşik, tam sayılı, ondalık ve yüzde) temsil etme ve karşılaştırma.',
      assessmentAndNotes: 'Kesir Modelleri Etkinliği · 18 Mart Çanakkale Zaferi',
    },
    {
      id: 'p5-7',
      term: '2. Dönem',
      weeks: '25–30. Hafta',
      month: 'Mart – Nisan',
      hours: '30 Saat',
      themeOrUnit: '4. Tema: İstatistiksel Araştırma Süreci & Veriden Olasılığa',
      learningOutcomeCode: 'MAT.5.5.1 – MAT.5.6.2',
      topicAndOutcome: 'Kategorik veri ile çalışma ve veriye dayalı karar verme (sıklık tablosu, sütun grafiği); olayların olasılığını "imkansız - kesin" aralığında yorumlama.',
      assessmentAndNotes: '2. Dönem 1. Ortak Yazılı Sınavı · 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı',
    },
    {
      id: 'p5-8',
      term: '2. Dönem',
      weeks: '31–36. Hafta',
      month: 'Mayıs – Haziran',
      hours: '30 Saat',
      themeOrUnit: '5. Tema: İşlemlerle Cebirsel Düşünme',
      learningOutcomeCode: 'MAT.5.2.1 – MAT.5.2.4',
      topicAndOutcome: 'Eşitliğin korunumu, işlem önceliği (parantezli işlemler), sayı ve şekil örüntülerinin kuralını bulma ve temel algoritmik akış şemaları.',
      assessmentAndNotes: '2. Dönem 2. Ortak Yazılı Sınavı · 19 Mayıs · Yıl Sonu Genel Tekrar',
    },
  ],
  'plan-6': [
    {
      id: 'p6-1',
      term: '1. Dönem',
      weeks: '1–5. Hafta',
      month: 'Eylül – Ekim',
      hours: '25 Saat',
      themeOrUnit: '1. Tema: Sayılar ve Nicelikler (1)',
      learningOutcomeCode: 'MAT.6.1.1 – MAT.6.1.3',
      topicAndOutcome: 'Karşılaştığı problemlerde çarpan ve kat ilişkisini belirleme; 2, 3, 4, 5, 6, 9 ve 10 ile bölünebilme kriterleri; asal sayılar, asal çarpanlar, ortak bölen ve ortak kat.',
      assessmentAndNotes: 'Bölünebilme ve Asal Çarpanlar Uygulama Föyü · İlköğretim Haftası',
    },
    {
      id: 'p6-2',
      term: '1. Dönem',
      weeks: '6–10. Hafta',
      month: 'Ekim – Kasım',
      hours: '25 Saat',
      themeOrUnit: '1. Tema: Sayılar ve Nicelikler (2) – Kesirler',
      learningOutcomeCode: 'MAT.6.1.4 – MAT.6.1.5',
      topicAndOutcome: 'Gerçek yaşam durumlarında kesirlerle toplama, çıkarma, çarpma ve bölme işlemlerini modelleme ve problem çözme.',
      assessmentAndNotes: '1. Dönem 1. Ortak Yazılı Sınavı · 29 Ekim & 10 Kasım',
    },
    {
      id: 'p6-3',
      term: '1. Dönem',
      weeks: '11–14. Hafta',
      month: 'Kasım – Aralık',
      hours: '20 Saat',
      themeOrUnit: '1. Tema: Sayılar ve Nicelikler (2) – Ondalık ve Yüzde',
      learningOutcomeCode: 'MAT.6.1.6 – MAT.6.1.8',
      topicAndOutcome: 'Ondalık gösterimlerin basamak değerleri, yuvarlama, ondalık gösterimlerle dört işlem, kesir-ondalık-yüzde ilişkisini kullanarak problem çözme.',
      assessmentAndNotes: 'Performans Görevi: Alışveriş ve Yüzde Hesapları',
    },
    {
      id: 'p6-4',
      term: '1. Dönem',
      weeks: '15–18. Hafta',
      month: 'Aralık – Ocak',
      hours: '20 Saat',
      themeOrUnit: '2. Tema: İstatistiksel Araştırma Süreci & Veriden Olasılığa',
      learningOutcomeCode: 'MAT.6.5.1 – MAT.6.6.2',
      topicAndOutcome: 'Kategorik veya nicel (kesikli) veri ile çalışma; nokta grafiği, kök-yaprak gösterimi, aritmetik ortalama ve açıklık; deneysel ve teorik olasılık.',
      assessmentAndNotes: '1. Dönem 2. Ortak Yazılı Sınavı · Veri Analizi Projesi',
    },
    {
      id: 'p6-5',
      term: '2. Dönem',
      weeks: '19–24. Hafta',
      month: 'Şubat – Mart',
      hours: '30 Saat',
      themeOrUnit: '3. Tema: İşlemlerle Cebirsel Düşünme',
      learningOutcomeCode: 'MAT.6.2.1 – MAT.6.2.3',
      topicAndOutcome: 'Gerçek yaşam durumlarına uygun cebirsel ifadeleri yazma, değişkenin alacağı değerler için cebirsel ifadenin değerini bulma ve aritmetik örüntüler.',
      assessmentAndNotes: 'Cebir Karoları Etkinliği · 18 Mart Çanakkale Zaferi',
    },
    {
      id: 'p6-6',
      term: '2. Dönem',
      weeks: '25–30. Hafta',
      month: 'Mart – Nisan',
      hours: '30 Saat',
      themeOrUnit: '4. Tema: Geometrik Şekiller',
      learningOutcomeCode: 'MAT.6.3.1 – MAT.6.3.4',
      topicAndOutcome: 'Komşu, tümler, bütünler ve ters açılar; üçgen ve dörtgenlerin iç ve dış açıları toplamı; paralelkenar, eşkenar dörtgen, yamuk ve dikdörtgenin temel özellikleri.',
      assessmentAndNotes: '2. Dönem 1. Ortak Yazılı Sınavı · Dinamik Geometri Uygulaması',
    },
    {
      id: 'p6-7',
      term: '2. Dönem',
      weeks: '31–36. Hafta',
      month: 'Mayıs – Haziran',
      hours: '30 Saat',
      themeOrUnit: '5. Tema: Geometrik Nicelikler',
      learningOutcomeCode: 'MAT.6.4.1 – MAT.6.4.4',
      topicAndOutcome: 'Uzunluk ve alan ölçme birimleri arasındaki dönüşümler; üçgen, paralelkenar ve bileşik şekillerin alan bağıntılarını oluşturma; çemberin çevre uzunluğu ve Pi (π) sayısı.',
      assessmentAndNotes: '2. Dönem 2. Ortak Yazılı Sınavı · Yıl Sonu Değerlendirme',
    },
  ],
  'plan-7': [
    {
      id: 'p7-1',
      term: '1. Dönem',
      weeks: '1–5. Hafta',
      month: 'Eylül – Ekim',
      hours: '25 Saat',
      themeOrUnit: '1. Ünite: Tam Sayılarla İşlemler',
      learningOutcomeCode: 'M.7.1.1.1 – M.7.1.1.6',
      topicAndOutcome: 'Tam sayılarla toplama ve çıkarma işlemleri, sayı doğrusu ve sayma pulları modelleri; tam sayılarla çarpma ve bölme; tam sayıların kendileriyle tekrarlı çarpımı (üslü nicelikler) ve tam sayı problemleri.',
      assessmentAndNotes: 'Tam Sayılar İzleme Testi · İlköğretim Haftası',
    },
    {
      id: 'p7-2',
      term: '1. Dönem',
      weeks: '6–10. Hafta',
      month: 'Ekim – Kasım',
      hours: '25 Saat',
      themeOrUnit: '2. Ünite: Rasyonel Sayılar ve Rasyonel Sayılarla İşlemler',
      learningOutcomeCode: 'M.7.1.2.1 – M.7.1.3.5',
      topicAndOutcome: 'Rasyonel sayıları tanıma ve sayı doğrusunda gösterme, devirli ondalık gösterimler, rasyonel sayıları sıralama; rasyonel sayılarla dört işlem, kare-küp hesapları ve çok adımlı işlemler.',
      assessmentAndNotes: '1. Dönem 1. Ortak Yazılı Sınavı · 29 Ekim & 10 Kasım',
    },
    {
      id: 'p7-3',
      term: '1. Dönem',
      weeks: '11–15. Hafta',
      month: 'Kasım – Aralık',
      hours: '25 Saat',
      themeOrUnit: '3. Ünite: Cebirsel İfadeler ve Eşitlik - Denklem',
      learningOutcomeCode: 'M.7.2.1.1 – M.7.2.2.4',
      topicAndOutcome: 'Cebirsel ifadelerle toplama ve çıkarma, bir doğal sayı ile bir cebirsel ifadeyi çarpma, sayı örüntülerinin kuralını harfle ifade etme; eşitliğin korunumu ve birinci dereceden bir bilinmeyenli denklem kurma ve çözme.',
      assessmentAndNotes: 'Denklem Kurma Çalışma Yaprağı',
    },
    {
      id: 'p7-4',
      term: '1. Dönem',
      weeks: '16–18. Hafta',
      month: 'Aralık – Ocak',
      hours: '15 Saat',
      themeOrUnit: '4. Ünite: Oran ve Orantı',
      learningOutcomeCode: 'M.7.1.4.1 – M.7.1.4.4',
      topicAndOutcome: 'Oranda çokluklardan birinin 1 olması durumunda diğerini bulma, orantı sabiti, doğru orantılı çoklukları grafik ve tablo ile gösterme.',
      assessmentAndNotes: '1. Dönem 2. Ortak Yazılı Sınavı',
    },
    {
      id: 'p7-5',
      term: '2. Dönem',
      weeks: '19–24. Hafta',
      month: 'Şubat – Mart',
      hours: '30 Saat',
      themeOrUnit: '4. Ünite: Oran-Orantı (Ters Orantı) ve Yüzdeler',
      learningOutcomeCode: 'M.7.1.4.5 – M.7.1.5.4',
      topicAndOutcome: 'Ters orantılı çokluklar ve problemleri; bir çokluğun belirtilen bir yüzdesine karşılık gelen miktarı bulma, bir çokluğu diğerinin yüzdesi olarak hesaplama, kâr-zarar-indirim-faiz problemleri.',
      assessmentAndNotes: 'Yüzde ve Finansal Okuryazarlık Etkinliği · 18 Mart',
    },
    {
      id: 'p7-6',
      term: '2. Dönem',
      weeks: '25–30. Hafta',
      month: 'Mart – Nisan',
      hours: '30 Saat',
      themeOrUnit: '5. Ünite: Doğrular ve Açılar, Çokgenler, Çember ve Daire',
      learningOutcomeCode: 'M.7.3.1.1 – M.7.3.3.3',
      topicAndOutcome: 'Açıortay, paralel iki doğru ve bir kesenin oluşturduğu yöndeş, iç ters, dış ters açılar; düzgün çokgenlerin kenar ve açı özellikleri; eşkenar dörtgen ve yamuğun alanı; çemberde merkez açı, yay uzunluğu ve daire diliminin alanı.',
      assessmentAndNotes: '2. Dönem 1. Ortak Yazılı Sınavı · 23 Nisan',
    },
    {
      id: 'p7-7',
      term: '2. Dönem',
      weeks: '31–36. Hafta',
      month: 'Mayıs – Haziran',
      hours: '30 Saat',
      themeOrUnit: '6. Ünite: Veri Analizi ve Cisimlerin Farklı Yönlerden Görünümleri',
      learningOutcomeCode: 'M.7.4.1.1 – M.7.3.4.2',
      topicAndOutcome: 'Çizgi grafiği, aritmetik ortalama, ortanca (medyan) ve tepe değer (mod), daire grafiği oluşturma ve veri gruplarını uygun grafik türleriyle dönüştürme; üç boyutlu cisimlerin farklı yönlerden iki boyutlu görünümlerini çizme.',
      assessmentAndNotes: '2. Dönem 2. Ortak Yazılı Sınavı · Yıl Sonu Değerlendirme',
    },
  ],
  'plan-8': [
    {
      id: 'p8-1',
      term: '1. Dönem',
      weeks: '1–5. Hafta',
      month: 'Eylül – Ekim',
      hours: '25 Saat',
      themeOrUnit: '1. Ünite: Çarpanlar ve Katlar & Üslü İfadeler',
      learningOutcomeCode: 'M.8.1.1.1 – M.8.1.2.5',
      topicAndOutcome: 'Pozitif tam sayıların asal çarpanları, EBOB ve EKOK problemleri, aralarında asal sayılar; tam sayıların tam sayı kuvvetleri, üslü ifadelerle çarpma-bölme, ondalık gösterimlerin 10’un kuvvetleriyle çözümlenmesi ve bilimsel gösterim.',
      assessmentAndNotes: 'LGS 1. Ünite Tarama Denemesi · İlköğretim Haftası',
    },
    {
      id: 'p8-2',
      term: '1. Dönem',
      weeks: '6–10. Hafta',
      month: 'Ekim – Kasım',
      hours: '25 Saat',
      themeOrUnit: '2. Ünite: Kareköklü İfadeler ve Veri Analizi',
      learningOutcomeCode: 'M.8.1.3.1 – M.8.4.1.2',
      topicAndOutcome: 'Tam kare pozitif tam sayılar, tam kare olmayan sayıların karekökünü tahmin etme, a√b gösterimi, kareköklü ifadelerde dört işlem, gerçek sayılar; çizgi, sütun ve daire grafikleri arasında dönüşüm ve yorumlama.',
      assessmentAndNotes: '1. Dönem 1. Ortak Yazılı Sınavı · LGS Kamp Denemesi 1',
    },
    {
      id: 'p8-3',
      term: '1. Dönem',
      weeks: '11–15. Hafta',
      month: 'Kasım – Aralık',
      hours: '25 Saat',
      themeOrUnit: '3. Ünite: Basit Olayların Olma Olasılığı & Cebirsel İfadeler ve Özdeşlikler',
      learningOutcomeCode: 'M.8.5.1.1 – M.8.2.1.4',
      topicAndOutcome: 'Bir olaya ait olası durumlar, eş olasılıklı olaylar ve basit bir olayın olma olasılığı; cebirsel ifadelerin çarpımı, iki kare farkı ve tam kare özdeşliklerini modelleme, cebirsel ifadeleri çarpanlara ayırma.',
      assessmentAndNotes: 'Özdeşlikler ve Çarpanlara Ayırma Çalışma Föyü',
    },
    {
      id: 'p8-4',
      term: '1. Dönem',
      weeks: '16–18. Hafta',
      month: 'Aralık – Ocak',
      hours: '15 Saat',
      themeOrUnit: '4. Ünite: Doğrusal Denklemler (1. Bölüm)',
      learningOutcomeCode: 'M.8.2.2.1 – M.8.2.2.2',
      topicAndOutcome: 'Birinci dereceden bir bilinmeyenli rasyonel katsayılı denklemleri çözme; koordinat sistemini özellikleriyle tanıma ve sıralı ikilileri gösterme.',
      assessmentAndNotes: '1. Dönem 2. Ortak Yazılı Sınavı · 1. Dönem Genel LGS Denemesi',
    },
    {
      id: 'p8-5',
      term: '2. Dönem',
      weeks: '19–23. Hafta',
      month: 'Şubat – Mart',
      hours: '25 Saat',
      themeOrUnit: '4. Ünite: Doğrusal İlişkiler, Eğim ve Eşitsizlikler',
      learningOutcomeCode: 'M.8.2.2.3 – M.8.2.3.3',
      topicAndOutcome: 'Aralarında doğrusal ilişki bulunan iki değişkenden birinin diğerine bağlı değişimini tablo, grafik ve denklem ile ifade etme; doğrunun eğimi; birinci dereceden bir bilinmeyenli eşitsizlikleri sayı doğrusunda gösterme ve çözme.',
      assessmentAndNotes: 'LGS Kamp Denemesi 2 · 18 Mart Çanakkale Zaferi',
    },
    {
      id: 'p8-6',
      term: '2. Dönem',
      weeks: '24–29. Hafta',
      month: 'Mart – Nisan',
      hours: '30 Saat',
      themeOrUnit: '5. Ünite: Üçgenler & Eşlik ve Benzerlik',
      learningOutcomeCode: 'M.8.3.1.1 – M.8.3.3.2',
      topicAndOutcome: 'Üçgende kenarortay, açıortay ve yükseklik; üçgen eşitsizliği, açı-kenar ilişkileri, Pisagor bağıntısı ve gerçek yaşam uygulamaları; eş ve benzer çokgenlerin kenar ve açı ilişkileri, benzerlik oranı.',
      assessmentAndNotes: '2. Dönem 1. Ortak Yazılı Sınavı · 23 Nisan',
    },
    {
      id: 'p8-7',
      term: '2. Dönem',
      weeks: '30–36. Hafta',
      month: 'Mayıs – Haziran',
      hours: '35 Saat',
      themeOrUnit: '6. Ünite: Dönüşüm Geometrisi & Geometrik Cisimler',
      learningOutcomeCode: 'M.8.3.2.1 – M.8.3.4.6',
      topicAndOutcome: 'Koordinat düzleminde öteleme ve yansıma dönüşümleri; dik prizmalar, dik dairesel silindirin temel elemanları, yüzey alanı ve hacmi; dik piramit ve dik koninin temel elemanları ve açınımları.',
      assessmentAndNotes: '2. Dönem 2. Ortak Yazılı Sınavı · LGS Genel Tekrar ve Seri Denemeler',
    },
  ],
  'plan-zumre': [
    {
      id: 'pz-1',
      term: '1. Dönem',
      weeks: 'Eylül Başı',
      month: 'Eylül',
      hours: 'Kurul',
      themeOrUnit: 'Sene Başı Matematik Zümre Kararı 1',
      learningOutcomeCode: 'TYMM – MEB',
      topicAndOutcome: '5. ve 6. sınıflarda Türkiye Yüzyılı Maarif Modeli (TYMM) öğretim programı ve tematik çerçeve planlarının, 7. ve 8. sınıflarda ise güncel MEB Matematik dersi öğretim programının haftalık 5 ders saati üzerinden uygulanmasına karar verildi.',
      assessmentAndNotes: 'Ünitelendirilmiş Yıllık Planların Onayı',
    },
    {
      id: 'pz-2',
      term: '1. Dönem',
      weeks: '1. ve 2. Yazılı',
      month: 'Kasım – Ocak',
      hours: 'Ortak Sınav',
      themeOrUnit: 'Ortak Yazılı Sınavlar ve Senaryolar',
      learningOutcomeCode: 'Ölçme Değerlendirme',
      topicAndOutcome: 'Her dönemde 2 ortak yazılı sınav yapılmasına, sınav sorularının tamamının MEB konu soru dağılım tablolarındaki senaryolara uygun açık uçlu sorulardan oluşturulmasına karar verildi.',
      assessmentAndNotes: 'Açık Uçlu Yazılı Senaryoları',
    },
    {
      id: 'pz-3',
      term: '2. Dönem',
      weeks: 'Şubat – Haziran',
      month: '2. Dönem',
      hours: 'Proje & LGS',
      themeOrUnit: 'Performans Görevleri ve 8. Sınıf Destekleme Süreci',
      learningOutcomeCode: 'Süreç Odaklı',
      topicAndOutcome: 'Öğrencilere dönem içinde en az 2 ders içi performans/süreç değerlendirmesi yapılmasına; 8. sınıf öğrencilerinin LGS hazırlık sürecinde beceri temelli soru çözüm ve deneme analizleriyle desteklenmesine karar verildi.',
      assessmentAndNotes: 'Proje Teslim: Nisan · LGS Hazırlık',
    },
  ],
};

export const INITIAL_LEFT_CATEGORIES: LeftSidebarCategory[] = [
  {
    id: 'yillik-planlar',
    title: 'Yıllık Planlarım (Maarif Modeli)',
    description: '2026-2027 Ortaokul Matematik 5, 6, 7 ve 8. Sınıf Planları',
    teacherOnly: true,
    items: [
      {
        id: 'plan-5',
        title: '5. Sınıf Matematik Türkiye Yüzyılı Maarif Modeli Planı',
        subtitle: '36 Haftalık Plan Hazır · 5 Tema · Haftalık 5 Saat',
        url: 'https://tymm.meb.gov.tr',
        type: 'plan',
        grade: '5',
        updatedAt: '2026-2027',
        sharedWithStudents: false,
      },
      {
        id: 'plan-6',
        title: '6. Sınıf Matematik Türkiye Yüzyılı Maarif Modeli Planı',
        subtitle: '36 Haftalık Plan Hazır · 5 Tema · Haftalık 5 Saat',
        url: 'https://tymm.meb.gov.tr',
        type: 'plan',
        grade: '6',
        updatedAt: '2026-2027',
        sharedWithStudents: false,
      },
      {
        id: 'plan-7',
        title: '7. Sınıf Matematik Ünitelendirilmiş Yıllık Plan',
        subtitle: '36 Haftalık Plan Hazır · 6 Ünite · Haftalık 5 Saat',
        url: 'https://mufredat.meb.gov.tr',
        type: 'plan',
        grade: '7',
        updatedAt: '2026-2027',
        sharedWithStudents: false,
      },
      {
        id: 'plan-8',
        title: '8. Sınıf Matematik Yıllık Plan & LGS Kamp Programı',
        subtitle: '36 Haftalık Plan Hazır · 6 Ünite · LGS Uyumlu',
        url: 'https://mufredat.meb.gov.tr',
        type: 'plan',
        grade: '8',
        updatedAt: '2026-2027',
        sharedWithStudents: false,
      },
      {
        id: 'plan-zumre',
        title: 'Matematik Zümre Öğretmenler Kurulu Tutanakları',
        subtitle: '1. ve 2. Dönem Zümre Kararları ve Sınav Senaryoları',
        url: 'https://tymm.meb.gov.tr',
        type: 'plan',
        grade: 'Genel',
        updatedAt: '2026-2027',
        sharedWithStudents: false,
      },
    ],
  },
  {
    id: 'sinif-yoklama',
    title: 'Sınıf Yoklama Listesi',
    description: '5, 6, 7 ve 8. Sınıf Öğrenci Devamsızlık ve Gözlem Çizelgeleri',
    teacherOnly: true,
    items: [
      {
        id: 'yoklama-5a',
        title: '5/A Sınıfı Matematik Yoklama ve Gözlem Listesi',
        subtitle: '26 Öğrenci · Derslik Z-02',
        url: '',
        type: 'attendance',
        grade: '5',
        updatedAt: 'Bugün',
        sharedWithStudents: false,
      },
      {
        id: 'yoklama-6b',
        title: '6/B Sınıfı Matematik Yoklama ve Gözlem Listesi',
        subtitle: '28 Öğrenci · Derslik 1-04',
        url: '',
        type: 'attendance',
        grade: '6',
        updatedAt: 'Bugün',
        sharedWithStudents: false,
      },
      {
        id: 'yoklama-7a',
        title: '7/A Sınıfı Matematik Yoklama ve Gözlem Listesi',
        subtitle: '25 Öğrenci · Derslik 2-03',
        url: '',
        type: 'attendance',
        grade: '7',
        updatedAt: 'Dün',
        sharedWithStudents: false,
      },
      {
        id: 'yoklama-8a',
        title: '8/A LGS Matematik Sınıfı Yoklama Listesi',
        subtitle: '24 Öğrenci · Derslik 3-01',
        url: '',
        type: 'attendance',
        grade: '8',
        updatedAt: 'Bugün',
        sharedWithStudents: false,
      },
    ],
  },
  {
    id: 'notlarim-linkler',
    title: 'Paylaşılan Web Siteleri & Kaynak Bağlantıları',
    description: 'Öğretmen ve Öğrenciler İçin Matematik Kaynak Siteleri',
    teacherOnly: false,
    items: [
      {
        id: 'link-tymm',
        title: 'MEB Türkiye Yüzyılı Maarif Modeli Resmi Portalı',
        subtitle: '5, 6, 7 ve 8. Sınıf Matematik Öğretim Programları',
        url: 'https://tymm.meb.gov.tr',
        type: 'portal',
        grade: 'Genel',
        updatedAt: 'MEB',
        sharedWithStudents: true,
      },
      {
        id: 'link-eba',
        title: 'EBA Ortaokul Matematik & Maarif Modeli Havuzu',
        subtitle: 'MEB Eğitim Bilişim Ağı Etkinlik ve Soruları',
        url: 'https://www.eba.gov.tr',
        type: 'portal',
        grade: 'Genel',
        updatedAt: 'MEB',
        sharedWithStudents: true,
      },
      {
        id: 'link-geogebra',
        title: 'GeoGebra İnteraktif Geometri ve Cebir Araçları',
        subtitle: '5–8. Sınıf Geometrik Çizimler ve Dönüşümler',
        url: 'https://www.geogebra.org',
        type: 'portal',
        grade: 'Genel',
        updatedAt: 'Araç',
        sharedWithStudents: true,
      },
      {
        id: 'link-drive',
        title: 'Murat Öğretmen Google Drive Çalışma Kağıtları',
        subtitle: 'Haftalık Matematik Föyleri ve Deneme PDF Klasörü',
        url: '',
        type: 'portal',
        grade: 'Genel',
        updatedAt: 'Bulut',
        sharedWithStudents: true,
      },
      {
        id: 'link-eokul',
        title: 'e-Okul Yönetim Bilgi Sistemi',
        subtitle: 'Yazılı Notları ve Devamsızlık İşlemleri',
        url: 'https://e-okul.meb.gov.tr',
        type: 'portal',
        grade: 'Genel',
        updatedAt: 'Resmi',
        sharedWithStudents: false,
      },
    ],
  },
];

export const INITIAL_NOTES: TeacherNote[] = [
  {
    id: 'note-1',
    title: 'Maarif Modeli Matematik Etkinlikleri ve Haftalık Ödevlendirme',
    content: '5, 6, 7 ve 8. sınıf öğrencilerimiz sağ paneldeki sınıflarına ait Türkiye Yüzyılı Maarif Modeli Matematik konularını inceleyebilir ve paylaşılan çalışma notlarını takip edebilirler.',
    url: '',
    category: 'Genel',
    createdAt: '22 Ekim 2026 · 09:30',
    pinned: true,
    sharedWithStudents: true,
  },
  {
    id: 'note-2',
    title: '5. ve 6. Sınıflar Maarif Modeli 1. Dönem 1. Ortak Yazılı Konuları',
    content: '5. sınıflarda Geometrik Şekiller (açı, çokgen, çember) ve Doğal Sayılar; 6. sınıflarda Çarpanlar ve Katlar, Asal Çarpanlar ve Kesirlerle İşlemler konularından açık uçlu sorular sorulacaktır.',
    url: '',
    category: '6. Sınıf',
    createdAt: '21 Ekim 2026 · 14:15',
    pinned: true,
    sharedWithStudents: true,
  },
  {
    id: 'note-3',
    title: '8. Sınıflar LGS Matematik Çarpanlar, Katlar ve Üslü İfadeler Kampı',
    content: 'Bu hafta 8/A sınıfı ile EBOB-EKOK problemleri ve üslü ifadelerde bilimsel gösterim taraması yapılacak. Cuma günü sınıfta Matematik Bilgi Düellosu turnuvası var!',
    url: '',
    category: '8. Sınıf',
    createdAt: '19 Ekim 2026 · 16:10',
    pinned: false,
    sharedWithStudents: true,
  },
  {
    id: 'note-4',
    title: '7. Sınıflar Tam Sayılar ve Rasyonel Sayılar Pekiştirme Notu',
    content: 'Tam sayılarla çarpma-bölme işlemlerinde işaret kuralları ve rasyonel sayıların sayı doğrusunda gösterimiyle ilgili çalışma yaprağı tamamlanacak.',
    url: '',
    category: '7. Sınıf',
    createdAt: '17 Ekim 2026 · 11:20',
    pinned: false,
    sharedWithStudents: true,
  },
];

export const INITIAL_GRADE_CONTENTS: GradeContentItem[] = [
  // 5. SINIF MATEMATİK (TÜRKİYE YÜZYILI MAARİF MODELİ)
  {
    id: 'g5-1',
    grade: '5',
    unitNumber: '1. Tema',
    title: 'Geometrik Şekiller: Temel Çizimler, Açılar, Çokgenler ve Çember',
    type: 'Konu Anlatımı',
    weekRange: '1–5. Hafta',
    summary: 'Türkiye Yüzyılı Maarif Modeli 5. sınıf matematik; nokta, doğru, ışın, açı ölçümü, çokgenler ve çemberde merkez-yarıçap inşası konu özeti.',
    url: '',
    sourceLabel: 'Maarif Modeli Matematik',
  },
  {
    id: 'g5-2',
    grade: '5',
    unitNumber: '2. Tema',
    title: 'Sayılar ve Nicelikler: Çok Basamaklı Doğal Sayılar ve İşlemler',
    type: 'İnteraktif Etkinlik',
    weekRange: '6–11. Hafta',
    summary: 'Bölükler, basamak değerleri, doğal sayılarla dört işlem stratejileri ve tahmin becerileri sınıf içi etkinlikleri.',
    url: '',
    sourceLabel: 'Maarif Modeli Matematik',
  },
  {
    id: 'g5-3',
    grade: '5',
    unitNumber: '2. Tema',
    title: 'Kesirler, Ondalık Gösterim ve Yüzde Kavramı Çalışma Fasikülü',
    type: 'Çalışma Yaprağı',
    weekRange: '12–16. Hafta',
    summary: 'Birim kesirler, bileşik ve tam sayılı kesirlerin karşılaştırılması ve farklı temsilleri üzerine çalışma yaprağı.',
    url: '',
    sourceLabel: 'Maarif Modeli Matematik',
  },
  {
    id: 'g5-4',
    grade: '5',
    unitNumber: '3. ve 4. Tema',
    title: 'Dikdörtgende Çevre-Alan, Veri Araştırması ve Algoritma Yazılı Provası',
    type: 'Sınav & Deneme',
    weekRange: 'Ortak Sınav',
    summary: 'Maarif Modeli açık uçlu yazılı senaryolarına uyumlu 5. sınıf matematik değerlendirme soruları.',
    url: '',
    sourceLabel: 'Maarif Modeli Matematik',
  },

  // 6. SINIF MATEMATİK (TÜRKİYE YÜZYILI MAARİF MODELİ)
  {
    id: 'g6-1',
    grade: '6',
    unitNumber: '1. Tema',
    title: 'Sayılar ve Nicelikler: Çarpanlar ve Katlar, Asal Çarpanlar, Ortak Bölen/Kat',
    type: 'Konu Anlatımı',
    weekRange: '1–5. Hafta',
    summary: 'Maarif Modeli 6. sınıf matematik; doğal sayıların çarpan ve katları, bölünebilme kuralları, asal sayılar, ortak bölen ve ortak kat konu anlatımı.',
    url: '',
    sourceLabel: 'Maarif Modeli Matematik',
  },
  {
    id: 'g6-2',
    grade: '6',
    unitNumber: '1. Tema',
    title: 'Kesirlerle İşlemler, Ondalık Gösterim ve Yüzde Hesaplamaları',
    type: 'Çalışma Yaprağı',
    weekRange: '6–11. Hafta',
    summary: 'Kesirlerle toplama, çıkarma, çarpma ve bölme işlemleri ile ondalık çözümler kazanım fasikülü.',
    url: '',
    sourceLabel: 'Maarif Modeli Matematik',
  },
  {
    id: 'g6-3',
    grade: '6',
    unitNumber: '2. Tema',
    title: 'İstatistik ve Olasılık: Nokta Grafiği, Kök-Yaprak ve Olasılık Deneyleri',
    type: 'İnteraktif Etkinlik',
    weekRange: '12–16. Hafta',
    summary: 'Maarif Modeli yeni konusu: Kategorik ve nicel veriye dayalı araştırma soruları, nokta grafiği, kök-yaprak gösterimi ve olasılık hesaplama.',
    url: '',
    sourceLabel: 'Maarif Modeli Matematik',
  },
  {
    id: 'g6-4',
    grade: '6',
    unitNumber: '3. ve 4. Tema',
    title: 'Cebirsel İfadeler, Örüntüler, Açılar ve Dörtgenler Yazılı Senaryoları',
    type: 'Sınav & Deneme',
    weekRange: 'Ortak Sınav',
    summary: '6. sınıf Maarif Modeli açık uçlu yazılı provaları ve beceri temelli tarama testleri.',
    url: '',
    sourceLabel: 'Maarif Modeli Matematik',
  },

  // 7. SINIF MATEMATİK
  {
    id: 'g7-1',
    grade: '7',
    unitNumber: '1. Ünite',
    title: 'Tam Sayılarla İşlemler: Toplama, Çıkarma, Çarpma, Bölme ve Üslü Nicelikler',
    type: 'Konu Anlatımı',
    weekRange: '1–5. Hafta',
    summary: 'Sayma pulları, sayı doğrusu modellemeleri ve tam sayıların kuvvetleri konu anlatımı.',
    url: '',
    sourceLabel: 'Ortaokul Matematik',
  },
  {
    id: 'g7-2',
    grade: '7',
    unitNumber: '2. Ünite',
    title: 'Rasyonel Sayılar ve Rasyonel Sayılarla Çok Adımlı İşlemler',
    type: 'Çalışma Yaprağı',
    weekRange: '6–10. Hafta',
    summary: 'Devirli ondalık gösterimler, rasyonel sayılarda sıralama ve çok adımlı işlemler soru föyü.',
    url: '',
    sourceLabel: 'Ortaokul Matematik',
  },
  {
    id: 'g7-3',
    grade: '7',
    unitNumber: '3. ve 4. Ünite',
    title: 'Cebirsel İfadeler, Birinci Dereceden Denklemler, Oran-Orantı ve Yüzdeler',
    type: 'İnteraktif Etkinlik',
    weekRange: '11–18. Hafta',
    summary: 'Eşitliğin korunumu ilkesi, doğru ve ters orantı problemleri ile yüzde hesaplamaları etkinlikleri.',
    url: '',
    sourceLabel: 'Ortaokul Matematik',
  },
  {
    id: 'g7-4',
    grade: '7',
    unitNumber: '5. ve 6. Ünite',
    title: 'Doğruda ve Çokgenlerde Açılar, Çember-Daire ve Veri Analizi Yazılı Kampı',
    type: 'Sınav & Deneme',
    weekRange: 'Ortak Sınav',
    summary: '7. sınıf matematik açık uçlu yazılı senaryoları ve ünite değerlendirme denemeleri.',
    url: '',
    sourceLabel: 'Ortaokul Matematik',
  },

  // 8. SINIF MATEMATİK (LGS & MAARİF MODELİ BECERİ TEMELLİ)
  {
    id: 'g8-1',
    grade: '8',
    unitNumber: '1. Ünite',
    title: 'Çarpanlar ve Katlar (EBOB–EKOK), Aralarında Asallık ve Üslü İfadeler',
    type: 'Konu Anlatımı',
    weekRange: '1–6. Hafta',
    summary: 'LGS Matematik 1. ünite; EBOB-EKOK problemleri, tam sayıların tam sayı kuvvetleri ve bilimsel gösterim.',
    url: '',
    sourceLabel: 'LGS & Maarif Modeli',
  },
  {
    id: 'g8-2',
    grade: '8',
    unitNumber: '2. Ünite',
    title: 'Kareköklü İfadeler ve Veri Analizi (Çizgi, Sütun ve Daire Grafiği)',
    type: 'Çalışma Yaprağı',
    weekRange: '7–12. Hafta',
    summary: 'Tam kare sayılar, kareköklü ifadelerle işlemler ve veri analizi grafik dönüşümleri yeni nesil fasikül.',
    url: '',
    sourceLabel: 'LGS & Maarif Modeli',
  },
  {
    id: 'g8-3',
    grade: '8',
    unitNumber: '3. ve 4. Ünite',
    title: 'Olasılık, Cebirsel İfadeler ve Özdeşlikler, Doğrusal Denklemler ve Eğim',
    type: 'İnteraktif Etkinlik',
    weekRange: '13–22. Hafta',
    summary: 'Basit olayların olma olasılığı, çarpanlara ayırma, koordinat sistemi ve doğrusal ilişkiler soru havuzu.',
    url: '',
    sourceLabel: 'LGS & Maarif Modeli',
  },
  {
    id: 'g8-4',
    grade: '8',
    unitNumber: '5. ve 6. Ünite',
    title: 'Üçgenler, Eşlik-Benzerlik, Dönüşüm Geometrisi ve LGS Deneme Sınavı',
    type: 'Sınav & Deneme',
    weekRange: 'LGS Kampı',
    summary: 'Pisagor bağıntısı, geometrik cisimler ve LGS beceri temelli deneme sınavları.',
    url: '',
    sourceLabel: 'LGS & Maarif Modeli',
  },
];

export const INITIAL_EXTERNAL_GAMES: ExternalGameLink[] = [
  {
    id: 'ext-1',
    title: 'Wordwall Ortaokul Matematik Etkinliklerim',
    category: 'Eşleştirme & Çarkıfelek',
    description: 'Kesirler, tam sayılar, cebirsel ifadeler ve geometri kavramlarını çarkıfelek ve labirent oyunlarıyla tekrar edin.',
    url: 'https://wordwall.net/tr',
    recommendedGrade: '5 ve 6. Sınıf',
  },
  {
    id: 'ext-2',
    title: 'Kahoot! Canlı Matematik Turnuvası',
    category: 'Çoktan Seçmeli Yarışma',
    description: 'Pin kodu ile sınıfça katılınan hızlı işlem ve ünite sonu ödüllü matematik bilgi yarışması.',
    url: 'https://kahoot.com',
    recommendedGrade: '5, 6, 7 ve 8. Sınıf',
  },
  {
    id: 'ext-3',
    title: 'GeoGebra Matematik & Geometri Atölyesi',
    category: 'İnteraktif Geometri',
    description: 'Çokgenler, çember, dönüşüm geometrisi ve doğrusal denklemleri dinamik olarak keşfedin.',
    url: 'https://www.geogebra.org',
    recommendedGrade: '5, 6, 7 ve 8. Sınıf',
  },
  {
    id: 'ext-4',
    title: 'PhET Matematik Simülasyonları (Kesirler & Denklem Terazisi)',
    category: 'Görsel Simülasyon',
    description: 'Kesir modelleri, eşitliğin korunumu terazisi ve olasılık simülasyonlarını deneyerek öğrenin.',
    url: 'https://phet.colorado.edu/tr/simulations/filter?subjects=math',
    recommendedGrade: '5, 6, 7 ve 8. Sınıf',
  },
  {
    id: 'ext-5',
    title: 'Quizizz LGS & Maarif Modeli Matematik Modu',
    category: 'Bireysel Hız & Tekrar',
    description: 'Yazılı ve LGS öncesi öğrencilerin kendi hızlarında çözebildiği oyunlaştırılmış matematik testleri.',
    url: 'https://quizizz.com',
    recommendedGrade: '7 ve 8. Sınıf',
  },
];

export const INITIAL_DUEL_QUESTIONS: DuelQuestion[] = [
  {
    id: 'q1',
    grade: '5',
    question: '5. Sınıf Maarif Modeli: Bir dikdörtgenin kısa kenarı 8 cm, uzun kenarı 14 cm ise bu dikdörtgenin çevresi kaç santimetredir?',
    options: ['22 cm', '44 cm', '56 cm', '112 cm'],
    correctIndex: 1,
    points: 100,
  },
  {
    id: 'q2',
    grade: '5',
    question: '5. Sınıf Maarif Modeli: Ölçüsü 90° ile 180° arasında olan açılara ne ad verilir?',
    options: ['Dar Açı', 'Dik Açı', 'Geniş Açı', 'Doğru Açı'],
    correctIndex: 2,
    points: 100,
  },
  {
    id: 'q3',
    grade: '6',
    question: '6. Sınıf Maarif Modeli: 72 sayısının birbirinden farklı asal çarpanlarının toplamı kaçtır?',
    options: ['5 (2 ve 3)', '6 (1, 2 ve 3)', '8 (3 ve 5)', '9 (2 ve 7)'],
    correctIndex: 0,
    points: 150,
  },
  {
    id: 'q4',
    grade: '6',
    question: '6. Sınıf Maarif Modeli: Bir torbadaki eş büyüklükteki 4 mavi, 5 kırmızı ve 3 sarı toptan rastgele çekilen bir topun kırmızı olma olasılığı kaçtır?',
    options: ['1/3', '5/12', '4/12', '5/7'],
    correctIndex: 1,
    points: 150,
  },
  {
    id: 'q5',
    grade: '7',
    question: '7. Sınıf Matematik: (-3)³ + (-2)² işleminin sonucu aşağıdakilerden hangisidir?',
    options: ['-31', '-23', '+23', '+31'],
    correctIndex: 1,
    points: 200,
  },
  {
    id: 'q6',
    grade: '7',
    question: '7. Sınıf Matematik: 3(x - 2) = 18 denkleminde x değeri kaçtır?',
    options: ['6', '7', '8', '9'],
    correctIndex: 2,
    points: 200,
  },
  {
    id: 'q7',
    grade: '8',
    question: '8. Sınıf LGS Matematik: Alanı 108 cm² olan bir karenin bir kenar uzunluğu kaç santimetredir?',
    options: ['6√2 cm', '6√3 cm', '9√2 cm', '12√3 cm'],
    correctIndex: 1,
    points: 250,
  },
  {
    id: 'q8',
    grade: '8',
    question: '8. Sınıf LGS Matematik: (2x + 3y)² cebirsel ifadesinin özdeşi aşağıdakilerden hangisidir?',
    options: [
      '4x² + 6xy + 9y²',
      '4x² + 12xy + 9y²',
      '2x² + 12xy + 3y²',
      '4x² - 12xy + 9y²',
    ],
    correctIndex: 1,
    points: 250,
  },
];

export const INITIAL_STUDENTS_BY_CLASS: Record<string, StudentAttendanceRecord[]> = {
  'yoklama-5a': [
    { id: 's1', number: '104', name: 'Ahmet Efe Yılmaz', status: 'Var' },
    { id: 's2', number: '112', name: 'Zeynep Su Demir', status: 'Var' },
    { id: 's3', number: '119', name: 'Kerem Arslan', status: 'Var' },
    { id: 's4', number: '125', name: 'Elif Naz Kaya', status: 'İzinli' },
    { id: 's5', number: '131', name: 'Mert Can Çelik', status: 'Var' },
    { id: 's6', number: '142', name: 'Defne Aydın', status: 'Var' },
    { id: 's7', number: '148', name: 'Emirhan Koç', status: 'Yok' },
    { id: 's8', number: '155', name: 'Yağmur Şahin', status: 'Var' },
  ],
  'yoklama-6b': [
    { id: 's101', number: '205', name: 'Bora Yıldız', status: 'Var' },
    { id: 's102', number: '214', name: 'Selin Özkan', status: 'Var' },
    { id: 's103', number: '221', name: 'Kaan Aksoy', status: 'Var' },
    { id: 's104', number: '233', name: 'Nisanur Polat', status: 'Var' },
    { id: 's105', number: '240', name: 'Tuna Güler', status: 'Yok' },
    { id: 's106', number: '249', name: 'Ece Korkmaz', status: 'Var' },
  ],
  'yoklama-7a': [
    { id: 's201', number: '301', name: 'Arda Turan Kurt', status: 'Var' },
    { id: 's202', number: '308', name: 'İrem Sena Doğan', status: 'Var' },
    { id: 's203', number: '315', name: 'Doruk Çetin', status: 'İzinli' },
    { id: 's204', number: '322', name: 'Melis Yalçın', status: 'Var' },
    { id: 's205', number: '330', name: 'Çınar Acar', status: 'Var' },
  ],
  'yoklama-8a': [
    { id: 's301', number: '402', name: 'Ceren Bozkurt', status: 'Var' },
    { id: 's302', number: '410', name: 'Oğuzhan Tekin', status: 'Var' },
    { id: 's303', number: '418', name: 'Sude Naz Avcı', status: 'Var' },
    { id: 's304', number: '429', name: 'Furkan Şen', status: 'Var' },
    { id: 's305', number: '437', name: 'Duru Erdem', status: 'Var' },
  ],
};
