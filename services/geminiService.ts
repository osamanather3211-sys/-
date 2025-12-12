import { GoogleGenAI } from "@google/genai";
import { MonthlyStats, SimulationState, UserSettings } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simple in-memory cache
let tipsCache: string[] | null = null;
let lastAnalysisTime = 0;
let lastAnalysisResult = "";

export const analyzeWaterUsage = async (
  currentStats: SimulationState,
  history: MonthlyStats[],
  userSettings?: UserSettings
): Promise<string> => {
  try {
    const now = Date.now();
    // Cache analysis for 10 seconds to prevent jitter/spamming API if called frequently
    if (now - lastAnalysisTime < 10000 && lastAnalysisResult) {
        return lastAnalysisResult;
    }

    // Determine leak context manually to guide the AI
    let leakContext = "لا يوجد تسريب حالياً.";
    if (currentStats.isLeaking) {
      if (currentStats.currentFlowRate > 10) {
        leakContext = "تحذير: يوجد تسريب كبير جداً! هذا يشير غالباً إلى مشكلة في الخزان الرئيسي أو العوامة.";
      } else {
        leakContext = "تحذير: يوجد تسريب منخفض ومستمر. هذا يشير غالباً إلى تسريب في المواسير الداخلية، الحنفيات، أو السيفون.";
      }
    }

    const userInfo = userSettings 
      ? `اسم المستخدم: ${userSettings.name}، عدد الخزانات: ${userSettings.tankCount}، موعد التعبئة: ${userSettings.refillDay}`
      : "مستخدم عام";

    const prompt = `
      تعمل كخبير صيانة سباكة ومستشار بيئي لتطبيق "قطرة".
      
      معلومات المستخدم:
      ${userInfo}

      الوضع الحالي:
      - معدل التدفق: ${currentStats.currentFlowRate.toFixed(1)} لتر/دقيقة
      - الاستهلاك اليومي: ${currentStats.totalToday.toFixed(1)} لتر
      - حالة النظام: ${leakContext}
      
      التعليمات المطلوبة (مهم جداً):
      1. إذا كان هناك "تسريب كبير"، اطلب من المستخدم فوراً التوجه لفحص الخزانات والعوامات.
      2. إذا كان هناك "تسريب صغير"، اطلب منه فحص المواسير الداخلية والسيفون.
      3. إذا لم يكن هناك تسريب، قدم نصيحة واحدة موجزة جداً للتوفير.
      
      الرد يجب أن يكون جملة أو جملتين فقط، موجهة للمستخدم مباشرة.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "حافظ على المياه، فهي ثروة.";
    lastAnalysisResult = text;
    lastAnalysisTime = now;
    return text;
  } catch (error) {
    console.error("Error analyzing water usage:", error);
    // Return cached result if available on error, or a safe default
    return lastAnalysisResult || "نظام التحليل الذكي يواجه ضغطاً حالياً، لكن مراقبة المياه مستمرة.";
  }
};

export const getEfficiencyTips = async (): Promise<string[]> => {
    // Return cached tips if they exist
    if (tipsCache) return tipsCache;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "أعطني قائمة بـ 3 نصائح عملية ومبتكرة وقصيرة لتوفير المياه في المنزل، بتنسيق JSON array of strings. لا تزد عن 10 كلمات لكل نصيحة.",
            config: {
                responseMimeType: "application/json"
            }
        });
        
        const text = response.text;
        if (!text) throw new Error("No text returned");
        
        const tips = JSON.parse(text);
        if (Array.isArray(tips) && tips.length > 0) {
            tipsCache = tips;
            return tips;
        }
        throw new Error("Invalid format");
    } catch (e) {
        // Fallback tips
        const fallback = ["تفقد عوامة الخزان بشكل دوري", "استخدم أكياس الإزاحة في السيفون", "ركب قطع توفير المياه على الصنابير"];
        tipsCache = fallback;
        return fallback;
    }
}
