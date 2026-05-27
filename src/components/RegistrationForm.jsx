import React, { useState } from 'react';
import { MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    cidade: '',
    idade: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic phone input masking for Brazilian format (XX) XXXXX-XXXX
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    let formattedValue = '';

    if (rawValue.length > 0) {
      formattedValue = `(${rawValue.substring(0, 2)}`;
    }
    if (rawValue.length > 2) {
      formattedValue += `) ${rawValue.substring(2, 7)}`;
    }
    if (rawValue.length > 7) {
      formattedValue += `-${rawValue.substring(7, 11)}`;
    }

    setFormData({ ...formData, whatsapp: formattedValue });
    
    // Clear validation error when typing
    if (errors.whatsapp) {
      setErrors({ ...errors, whatsapp: null });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Por favor, informe seu nome completo.';
    
    const rawPhone = formData.whatsapp.replace(/\D/g, '');
    if (rawPhone.length < 10 || rawPhone.length > 11) {
      newErrors.whatsapp = 'Digite um número de WhatsApp válido com DDD.';
    }
    
    if (!formData.cidade.trim()) newErrors.cidade = 'Por favor, informe sua cidade/bairro.';
    if (!formData.idade) newErrors.idade = 'Selecione a faixa etária da criança.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulated micro-animation delay for premium feedback
    setTimeout(() => {
      const message = `Olá! Me chamo ${formData.nome}, moro em ${formData.cidade} e tenho um filho(a) na faixa de ${formData.idade}. Gostaria de agendar uma aula experimental da Swim Home! 🏊`;
      
      // WhatsApp redirect link
      const waUrl = `https://wa.me/5547992570198?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
      
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white/10 sm:bg-white text-white sm:text-water-deep rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/20 sm:border-4 sm:border-water-light/30 relative overflow-hidden">
      
      {/* Wave decor in the background of card */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-water-light/10 rounded-full blur-2xl -z-10" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-sun/15 rounded-full blur-xl -z-10" />

      <h3 className="font-display font-black text-2xl sm:text-3xl text-white sm:text-water-deep text-center mb-2 leading-tight">
        Agende uma Aula Experimental
      </h3>
      <p className="text-center text-white/80 sm:text-gray-600 text-sm sm:text-base mb-8">
        Preencha os dados e fale diretamente conosco via WhatsApp para escolher o melhor dia e horário!
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Nome completo */}
        <div>
          <label htmlFor="nome" className="block text-sm font-bold text-white sm:text-water-deep mb-1.5">
            Nome Completo do Responsável
          </label>
          <div className="relative">
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Maria Silva"
              className={`w-full px-4 py-3 rounded-2xl border sm:border-2 bg-white/5 sm:bg-foam/30 text-white sm:text-water-deep placeholder-white/50 sm:placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-water-mid transition-all duration-200
                ${errors.nome ? 'border-red-500 bg-red-500/20' : 'border-white/20 sm:border-water-light/40 focus:border-water-mid'}`}
            />
            {errors.nome && (
              <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs font-bold">
                <AlertCircle size={14} />
                <span>{errors.nome}</span>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-bold text-white sm:text-water-deep mb-1.5">
            WhatsApp (com DDD)
          </label>
          <div className="relative">
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handlePhoneChange}
              placeholder="Ex: (47) 99999-9999"
              className={`w-full px-4 py-3 rounded-2xl border sm:border-2 bg-white/5 sm:bg-foam/30 text-white sm:text-water-deep placeholder-white/50 sm:placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-water-mid transition-all duration-200
                ${errors.whatsapp ? 'border-red-500 bg-red-500/20' : 'border-white/20 sm:border-water-light/40 focus:border-water-mid'}`}
            />
            {errors.whatsapp && (
              <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs font-bold">
                <AlertCircle size={14} />
                <span>{errors.whatsapp}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cidade / Bairro */}
        <div>
          <label htmlFor="cidade" className="block text-sm font-bold text-white sm:text-water-deep mb-1.5">
            Cidade e Bairro onde reside
          </label>
          <div className="relative">
            <input
              type="text"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              placeholder="Ex: Balneário Camboriú - Centro"
              className={`w-full px-4 py-3 rounded-2xl border sm:border-2 bg-white/5 sm:bg-foam/30 text-white sm:text-water-deep placeholder-white/50 sm:placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-water-mid transition-all duration-200
                ${errors.cidade ? 'border-red-500 bg-red-500/20' : 'border-white/20 sm:border-water-light/40 focus:border-water-mid'}`}
            />
            {errors.cidade && (
              <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs font-bold">
                <AlertCircle size={14} />
                <span>{errors.cidade}</span>
              </div>
            )}
          </div>
        </div>

        {/* Idade da criança */}
        <div>
          <label htmlFor="idade" className="block text-sm font-bold text-white sm:text-water-deep mb-1.5">
            Idade da Criança
          </label>
          <div className="relative">
            <select
              id="idade"
              name="idade"
              value={formData.idade}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-2xl border sm:border-2 bg-white/5 sm:bg-foam/30 text-white sm:text-water-deep placeholder-white/50 sm:placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-water-mid transition-all duration-200 appearance-none cursor-pointer
                ${errors.idade ? 'border-red-500 bg-red-500/20' : 'border-white/20 sm:border-water-light/40 focus:border-water-mid'}`}
            >
              <option value="" disabled className="text-gray-400">Selecione uma faixa etária</option>
              <option value="6 meses a 2 anos" className="text-[#030d18]">6 meses a 2 anos (Natação para Bebês)</option>
              <option value="3 a 5 anos" className="text-[#030d18]">3 a 5 anos (Natação Infantil Inicial)</option>
              <option value="6 a 10 anos" className="text-[#030d18]">6 a 10 anos (Natação Infantil Avançada)</option>
              <option value="11 anos ou mais" className="text-[#030d18]">11 anos ou mais (Aprimoramento/Técnica)</option>
            </select>
            {/* Custom arrow icon for dropdown */}
            <div className="absolute right-4 top-[60%] transform -translate-y-1/2 pointer-events-none text-white sm:text-water-deep font-bold">
              ▼
            </div>
            {errors.idade && (
              <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs font-bold">
                <AlertCircle size={14} />
                <span>{errors.idade}</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sun hover:bg-[#ebd02c] active:scale-98 text-water-deep font-display font-black text-lg py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-2xl border-2 border-white hover:translate-y-[-2px] disabled:opacity-50 disabled:pointer-events-none mt-8"
        >
          <MessageCircle size={22} className="fill-water-deep stroke-none" />
          <span>{isSubmitting ? 'Redirecionando...' : 'Agendar Minha Aula Experimental'}</span>
        </button>

        {/* Dynamic secure note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-white/60 sm:text-gray-500 mt-4 text-center">
          <CheckCircle2 size={13} className="text-green-500" />
          <span>Seus dados não são enviados para bancos de dados — Contato 100% via WhatsApp.</span>
        </div>

      </form>
    </div>
  );
}
