'use client'
import { useEffect, useRef, useState } from 'react'
import { Save, Loader2, CheckCircle, Upload, ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

/* ── Small reusable upload zone ─────────────────────────── */
function UploadZone({
  label, hint, currentUrl, onUploaded, uploadType,
}: {
  label: string; hint: string; currentUrl?: string | null
  onUploaded: (url: string) => void; uploadType: 'logo' | 'hero'
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview,   setPreview]   = useState<string | null>(currentUrl ?? null)

  const handle = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', uploadType)
    const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) {
      setPreview(data.url + '?t=' + Date.now())   // bust cache
      onUploaded(data.url)
    }
    setUploading(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handle(f)
  }

  return (
    <div className="space-y-2">
      <label className="text-gray-500 text-xs uppercase tracking-wider font-medium block">{label}</label>
      <p className="text-gray-700 text-xs mb-2">{hint}</p>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        className="relative border-2 border-dashed border-[#2a2a2a] hover:border-orange-500/50 rounded-xl p-6 cursor-pointer transition-colors flex flex-col items-center gap-3 bg-[#0d0d0d]"
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="preview" className="max-h-20 max-w-[200px] object-contain rounded-lg" />
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setPreview(null); onUploaded('') }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            >
              <X size={10} className="text-white" />
            </button>
          </div>
        ) : (
          <ImageIcon size={32} className="text-gray-700" />
        )}

        {uploading ? (
          <div className="flex items-center gap-2 text-orange-400 text-sm">
            <Loader2 size={15} className="animate-spin" />Envoi en cours…
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
              <Upload size={14} />Cliquez ou glissez une image ici
            </p>
            <p className="text-gray-700 text-xs mt-1">JPG, PNG, WebP — max 5 Mo</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handle(f) }}
        />
      </div>
    </div>
  )
}

/* ── Main page ───────────────────────────────────────────── */
export default function AdminSitePage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => { setSettings(d); setLoading(false) })
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const upd = (k: string, v: any) => setSettings((s: any) => ({ ...s, [k]: v }))

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const inputCls = 'w-full bg-[#111] border border-[#1f1f1f] focus:border-orange-500/40 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors placeholder-gray-700'

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Paramètres du site</h1>
          <p className="text-gray-600 text-sm">Personnalisez l'apparence et le contenu</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors">
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      {/* Live preview */}
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
          {settings.logoUrl
            ? <img src={settings.logoUrl} alt="logo" className="w-full h-full object-cover" />
            : <span className="font-black text-black text-xl">{settings.siteName?.charAt(0) ?? 'M'}</span>
          }
        </div>
        <div>
          <div className="text-white font-bold">{settings.siteName || "Maison de l'Attiéké"}</div>
          <div className="text-orange-400 text-sm italic">{settings.slogan || ''}</div>
        </div>
        <div className="ml-auto text-xs text-gray-700">Aperçu</div>
      </div>

      {/* ── Identité ──────────────────────────────────────── */}
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#141414] bg-[#0a0a0a]">
          <h2 className="text-white font-semibold text-sm">Identité du restaurant</h2>
        </div>
        <div className="p-5 space-y-5">
          <UploadZone
            label="Logo du site"
            hint="Importez votre logo depuis votre PC. Il remplacera la lettre dans la navbar."
            currentUrl={settings.logoUrl}
            uploadType="logo"
            onUploaded={url => upd('logoUrl', url)}
          />

          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5 block">Nom du site</label>
            <input type="text" value={settings.siteName || ''} onChange={e => upd('siteName', e.target.value)}
              placeholder="Maison de l'Attiéké" className={inputCls} />
          </div>
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5 block">Slogan</label>
            <input type="text" value={settings.slogan || ''} onChange={e => upd('slogan', e.target.value)}
              placeholder="L'attiéké comme vous ne l'avez jamais goûté." className={inputCls} />
          </div>
        </div>
      </div>

      {/* ── Page d'accueil ────────────────────────────────── */}
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#141414] bg-[#0a0a0a]">
          <h2 className="text-white font-semibold text-sm">Page d'accueil</h2>
        </div>
        <div className="p-5 space-y-5">
          <UploadZone
            label="Image d'arrière-plan (Hero)"
            hint="Photo de plat qui s'affiche en grand derrière le titre. Sera sauvegardée sous /hero-bg.jpg"
            currentUrl={null}
            uploadType="hero"
            onUploaded={() => {}}
          />
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5 block">Titre principal (Hero)</label>
            <textarea value={settings.heroTitle || ''} onChange={e => upd('heroTitle', e.target.value)} rows={3}
              placeholder="L'ATTIÉKÉ COMME VOUS NE L'AVEZ JAMAIS GOÛTÉ."
              className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5 block">Sous-titre Hero</label>
            <input type="text" value={settings.heroSubtitle || ''} onChange={e => upd('heroSubtitle', e.target.value)}
              placeholder="Composez votre plat comme vous voulez…" className={inputCls} />
          </div>
        </div>
      </div>

      {/* ── Coordonnées ───────────────────────────────────── */}
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#141414] bg-[#0a0a0a]">
          <h2 className="text-white font-semibold text-sm">Coordonnées</h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            { key: 'telephone', label: 'Téléphone',  type: 'text',  ph: '+225 07 07 07 07 07' },
            { key: 'adresse',   label: 'Adresse',    type: 'text',  ph: 'Cocody, Abidjan'     },
            { key: 'email',     label: 'Email',      type: 'email', ph: 'contact@...'         },
          ].map(({ key, label, type, ph }) => (
            <div key={key}>
              <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5 block">{label}</label>
              <input type={type} value={settings[key] || ''} onChange={e => upd(key, e.target.value)}
                placeholder={ph} className={inputCls} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Horaires & tarifs ─────────────────────────────── */}
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#141414] bg-[#0a0a0a]">
          <h2 className="text-white font-semibold text-sm">Horaires & Tarifs</h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            { key: 'ouvertureHeure',  label: "Heure d'ouverture",      type: 'time',   ph: '10:00' },
            { key: 'fermetureHeure',  label: 'Heure de fermeture',      type: 'time',   ph: '23:00' },
            { key: 'fraisLivraison',  label: 'Frais de livraison (F)',  type: 'number', ph: '500'   },
          ].map(({ key, label, type, ph }) => (
            <div key={key}>
              <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5 block">{label}</label>
              <input type={type} value={settings[key] || ''} placeholder={ph}
                onChange={e => upd(key, type === 'number' ? Number(e.target.value) : e.target.value)}
                className={inputCls} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Service Clients ───────────────────────────────── */}
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#141414] bg-[#0a0a0a]">
          <h2 className="text-white font-semibold text-sm">Service clients & Support</h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5 block">Téléphone support</label>
            <input type="text" value={settings.supportTelephone || ''} onChange={e => upd('supportTelephone', e.target.value)}
              placeholder="+225 07 07 07 07 07" className={inputCls} />
          </div>
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5 block">WhatsApp support</label>
            <input type="text" value={settings.supportWhatsapp || ''} onChange={e => upd('supportWhatsapp', e.target.value)}
              placeholder="+2250707070707" className={inputCls} />
          </div>
        </div>
      </div>

      {/* ── À propos ──────────────────────────────────────── */}
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#141414] bg-[#0a0a0a]">
          <h2 className="text-white font-semibold text-sm">Page « À propos »</h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5 block">Description courte</label>
            <textarea value={settings.aboutDescription || ''} onChange={e => upd('aboutDescription', e.target.value)} rows={3}
              placeholder="Courte présentation du restaurant affichée en hero…"
              className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5 block">Notre histoire</label>
            <textarea value={settings.aboutHistoire || ''} onChange={e => upd('aboutHistoire', e.target.value)} rows={4}
              placeholder="L'histoire et les valeurs de votre restaurant…"
              className={`${inputCls} resize-none`} />
          </div>
          <div className="pt-2 border-t border-[#1a1a1a]">
            <p className="text-gray-600 text-xs mb-3 uppercase tracking-wider font-medium">Réseaux sociaux & contact</p>
            {[
              { key: 'whatsapp',    label: 'WhatsApp (numéro)',   ph: '+2250707070707'                        },
              { key: 'instagram',   label: 'Instagram (URL)',      ph: 'https://instagram.com/maison_attieke'  },
              { key: 'facebook',    label: 'Facebook (URL)',       ph: 'https://facebook.com/maisonattieke'    },
              { key: 'googleMapsUrl', label: 'Lien Google Maps',  ph: 'https://maps.google.com/?q=...'        },
            ].map(({ key, label, ph }) => (
              <div key={key} className="mb-3 last:mb-0">
                <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5 block">{label}</label>
                <input type="text" value={settings[key] || ''} onChange={e => upd(key, e.target.value)}
                  placeholder={ph} className={inputCls} />
              </div>
            ))}
          </div>

          {/* Toggle chat */}
          <div className="pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Chat en direct activé</p>
              <p className="text-gray-600 text-xs">Affiche le widget de chat sur le site</p>
            </div>
            <button
              type="button"
              onClick={() => upd('chatActif', !settings.chatActif)}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.chatActif !== false ? 'bg-orange-500' : 'bg-[#2a2a2a]'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.chatActif !== false ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-black font-bold px-6 py-3 rounded-xl transition-colors">
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? 'Modifications enregistrées !' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  )
}
