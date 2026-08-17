import React, { useState } from 'react';
import {
  Stethoscope,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  Loader2,
  Leaf,
  ShieldCheck,
  ArrowRight,
  Scan
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';

interface PlantDoctorViewProps {
  onNavigateToPesticides: (query?: string) => void;
}

const SAMPLE_LEAF_IMAGES = [
  {
    name: 'Tomato Early Blight',
    crop: 'Tomato',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400',
  },
  {
    name: 'Potato Late Blight',
    crop: 'Potato',
    url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
  },
  {
    name: 'Cotton Leaf Bollworm',
    crop: 'Cotton',
    url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400',
  },
  {
    name: 'Healthy Crop Leaf',
    crop: 'Healthy',
    url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
  },
];

export const PlantDoctorView: React.FC<PlantDoctorViewProps> = ({
  onNavigateToPesticides,
}) => {
  const { t } = useLanguage();

  const [selectedImage, setSelectedImage] = useState<string>(
    SAMPLE_LEAF_IMAGES[0].url
  );
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [isScanning, setIsScanning] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<any | null>(null);

  const handleRunDiagnosis = async (imgUrl: string, cropHint: string) => {
    setSelectedImage(imgUrl);
    setSelectedCrop(cropHint);
    setIsScanning(true);
    setDiagnosisResult(null);

    try {
      const formData = new FormData();
      formData.append('crop_name', cropHint);
      formData.append('image_url', imgUrl);

      const res = await apiFetch<any>('/disease/detect', {
        method: 'POST',
        body: formData,
      });

      setTimeout(() => {
        setDiagnosisResult(res);
        setIsScanning(false);
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 },
        });
      }, 1200);
    } catch (err) {
      console.error('Diagnosis failed:', err);
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">{t.disease.title}</h2>
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40">
                AI Vision 2.0
              </span>
            </div>
            <p className="text-xs opacity-75 mt-0.5 max-w-2xl">
              {t.disease.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upload & Sample Picker */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-3xl p-5 space-y-4">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-violet-400" />
              {t.disease.uploadPrompt}
            </h3>

            {/* Active Leaf Preview Frame with Scanner Grid */}
            <div className="relative h-64 rounded-3xl overflow-hidden glass-card flex items-center justify-center group">
              <img
                src={selectedImage}
                alt="Selected leaf"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Viewfinder crosshairs */}
              <div className="absolute inset-4 border border-violet-400/40 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-3 h-3 border-t-2 border-l-2 border-violet-400" />
                  <div className="w-3 h-3 border-t-2 border-r-2 border-violet-400" />
                </div>
                <div className="flex justify-between">
                  <div className="w-3 h-3 border-b-2 border-l-2 border-violet-400" />
                  <div className="w-3 h-3 border-b-2 border-r-2 border-violet-400" />
                </div>
              </div>

              {/* Scanning Animation Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-violet-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full border-4 border-violet-400 border-t-transparent animate-spin" />
                  <span className="text-xs font-black text-violet-300 animate-pulse">
                    {t.disease.analyzingLeaf}
                  </span>
                </div>
              )}
            </div>

            {/* Run Button */}
            <button
              onClick={() => handleRunDiagnosis(selectedImage, selectedCrop)}
              disabled={isScanning}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white font-black text-xs shadow-xl shadow-violet-950/60 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI Neural Scanning...</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" />
                  <span>Scan & Diagnose Leaf Pathology</span>
                </>
              )}
            </button>

            {/* Sample Selector */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-xs font-bold opacity-75 block">
                {t.disease.selectSample}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_LEAF_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunDiagnosis(sample.url, sample.crop)}
                    className={`p-2 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      selectedImage === sample.url
                        ? 'bg-violet-500/20 border-violet-500 text-violet-300 font-bold'
                        : 'glass-card opacity-80 hover:opacity-100 hover:border-violet-500/40'
                    }`}
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div className="truncate">
                      <span className="text-[11px] font-bold block truncate">
                        {sample.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Diagnostic Results & Treatment Card */}
        <div className="lg:col-span-7">
          {diagnosisResult ? (
            <div className="glass-card rounded-3xl p-6 border-violet-500/40 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
                      {diagnosisResult.crop_name} Pathology
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40">
                      {diagnosisResult.confidence}% {t.disease.confidenceScore}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black mt-1">
                    {diagnosisResult.detected_disease}
                  </h3>
                </div>

                <span
                  className={`text-xs font-black px-3.5 py-1.5 rounded-xl self-start sm:self-auto ${
                    diagnosisResult.severity === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : diagnosisResult.severity.includes('High')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  Severity: {diagnosisResult.severity}
                </span>
              </div>

              {/* Observed Symptoms */}
              <div className="p-4 rounded-2xl glass-card space-y-1">
                <span className="text-[10px] uppercase font-bold opacity-75 block">
                  {t.disease.symptoms}
                </span>
                <p className="text-xs opacity-90 leading-relaxed">
                  {diagnosisResult.symptoms}
                </p>
              </div>

              {/* Dual Treatments: Organic & Chemical */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                  <span className="text-[10px] uppercase font-black text-emerald-400 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" />
                    {t.disease.organicRemedy}
                  </span>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {diagnosisResult.organic_remedy}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-1.5">
                  <span className="text-[10px] uppercase font-black text-cyan-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.disease.chemicalTreatment}
                  </span>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {diagnosisResult.chemical_treatment}
                  </p>
                </div>
              </div>

              {/* Verified Pesticide Store Connector */}
              {diagnosisResult.recommended_product_name && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 to-slate-900 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-purple-400 block">
                      Recommended Certified Treatment
                    </span>
                    <h4 className="text-sm font-black text-white mt-0.5">
                      {diagnosisResult.recommended_product_name}
                    </h4>
                    <span className="text-xs font-black text-emerald-400">
                      ₹{diagnosisResult.recommended_product_price} (Certified Agri-Kendra)
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      onNavigateToPesticides(
                        diagnosisResult.recommended_product_name.split(' ')[0]
                      )
                    }
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg shadow-purple-950/60 transition-all hover:scale-105 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Treatment Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-12 text-center opacity-75 border h-full flex flex-col items-center justify-center space-y-3">
              <Stethoscope className="w-12 h-12 text-violet-400 animate-pulse" />
              <h4 className="font-bold text-base">
                Ready for AI Crop Pathology Scan
              </h4>
              <p className="text-xs max-w-sm opacity-75">
                Click "Scan & Diagnose Leaf Pathology" to run neural pathological analysis on the selected leaf photo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
