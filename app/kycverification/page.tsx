"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle } from "lucide-react"

interface FormData {
  religion: string
  fullName: string
  maritalStatus: string
  residentialAddress: string
  community: string
  dateOfBirth: string
  state: string
  lga: string
  nin: string
}

const NIGERIA_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
  "Yobe", "Zamfara"
]

const LGA_BY_STATE: Record<string, string[]> = {
  Abia: [
    "Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North",
    "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo",
    "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"
  ],
  Adamawa: [
    "Demsa", "Fufore", "Ganye", "Gayuk", "Gombi", "Grie", "Hong", "Jada", "Lamurde",
    "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan",
    "Shelleng", "Song", "Toungo", "Yola North", "Yola South"
  ],
  "Akwa Ibom": [
    "Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan",
    "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene",
    "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara",
    "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"
  ],
  Anambra: [
    "Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South",
    "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala",
    "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South",
    "Orumba North", "Orumba South", "Oyi"
  ],
  Bauchi: [
    "Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa",
    "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira",
    "Tafawa Balewa", "Toro", "Warji", "Zaki"
  ],
  Bayelsa: [
    "Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"
  ],
  Benue: [
    "Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West",
    "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo",
    "Ohimini", "Oju", "Okpokwu", "Oturkpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"
  ],
  Borno: [
    "Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa",
    "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga",
    "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar",
    "Monguno", "Ngala", "Nganzai", "Shani"
  ],
  "Cross River": [
    "Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal",
    "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja",
    "Yakuur", "Yala"
  ],
  Delta: [
    "Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West",
    "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West",
    "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North",
    "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"
  ],
  Ebonyi: [
    "Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South",
    "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"
  ],
  Edo: [
    "Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West",
    "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Oredo",
    "Orhionmwon", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"
  ],
  Ekiti: [
    "Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure",
    "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun",
    "Ise/Orun", "Moba", "Oye"
  ],
  Enugu: [
    "Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti",
    "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka",
    "Oji River", "Udenu", "Udi", "Uzo Uwani"
  ],
  FCT: [
    "Abuja Municipal", "Bwari", "Gwagwalada", "Kuje", "Kwali"
  ],
  Gombe: [
    "Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami",
    "Nafada", "Shongom", "Yamaltu/Deba"
  ],
  Imo: [
    "Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South",
    "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba",
    "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu",
    "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"
  ],
  Jigawa: [
    "Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki",
    "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kaugama",
    "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim",
    "Roni", "Sule Tankarkar", "Taura", "Yankwashi"
  ],
  Kaduna: [
    "Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia",
    "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau",
    "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"
  ],
  Kano: [
    "Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta",
    "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garum",
    "Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye",
    "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir",
    "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni",
    "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"
  ],
  Katsina: [
    "Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume",
    "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa",
    "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada",
    "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa",
    "Safana", "Sandamu", "Zango"
  ],
  Kebbi: [
    "Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza",
    "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski",
    "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"
  ],
  Kogi: [
    "Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu",
    "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo",
    "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"
  ],
  Kwara: [
    "Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South",
    "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"
  ],
  Lagos: [
    "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry",
    "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe",
    "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"
  ],
  Nasarawa: [
    "Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa",
    "Nasarawa Egon", "Obi", "Toto", "Wamba"
  ],
  Niger: [
    "Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako",
    "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu",
    "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"
  ],
  Ogun: [
    "Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South",
    "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode",
    "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside",
    "Remo North", "Shagamu"
  ],
  Ondo: [
    "Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West",
    "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo",
    "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"
  ],
  Osun: [
    "Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro",
    "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central", "Ife East",
    "Ife North", "Ife South", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West",
    "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda",
    "Oriade", "Orolu", "Osogbo"
  ],
  Oyo: [
    "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East",
    "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central",
    "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa",
    "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo",
    "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East",
    "Saki West", "Surulere"
  ],
  Plateau: [
    "Bokkos", "Barkin Ladi", "Bassa", "Jos East", "Jos North", "Jos South", "Kanam",
    "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan",
    "Riyom", "Shendam", "Wase"
  ],
  Rivers: [
    "Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru",
    "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana",
    "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro",
    "Oyigbo", "Port Harcourt", "Tai"
  ],
  Sokoto: [
    "Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela",
    "Isa", "Kebbe", "Kware", "Rabah", "Sabo Birni", "Shagari", "Silame", "Sokoto North",
    "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"
  ],
  Taraba: [
    "Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido",
    "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"
  ],
  Yobe: [
    "Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani",
    "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"
  ],
  Zamfara: [
    "Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau",
    "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Tsafe", "Zurmi"
  ]
}

const INITIAL_FORM: FormData = {
  religion: "",
  fullName: "",
  maritalStatus: "",
  residentialAddress: "",
  community: "",
  dateOfBirth: "",
  state: "",
  lga: "",
  nin: "",
}

export default function KycVerificationPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [selectedState, setSelectedState] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { currentUser, completeKyc, kycCompleted } = useAuth()

  // If KYC is already completed, show the completed status UI..
  if (kycCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <motion.h1
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              KYC Verification Completed
            </motion.h1>
            <motion.p
              className="text-muted-foreground mt-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Your identity has been verified successfully
            </motion.p>
          </div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-4">Verification Status: Verified</h2>
              <p className="text-gray-600 mb-6">
                Your KYC verification has been completed and approved. You now have full access to all platform features.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/dashboard")} className="gradient-primary">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (name === "state") {
      setSelectedState(value)
      setFormData((prev) => ({ ...prev, lga: "" }))
    }
  }

  const validateStep = () => {
    let stepErrors: Record<string, string> = {}
    if (step === 1) {
      if (!formData.religion) stepErrors.religion = "Religion is required"
      if (!formData.fullName) stepErrors.fullName = "Full name is required"
      if (!formData.maritalStatus) stepErrors.maritalStatus = "Marital status is required"
      if (!formData.dateOfBirth) stepErrors.dateOfBirth = "Date of birth is required"
      if (!formData.nin || formData.nin.length !== 11) stepErrors.nin = "NIN must be exactly 11 digits"
    } else if (step === 2) {
      if (!formData.state) stepErrors.state = "State is required"
      if (!formData.lga) stepErrors.lga = "LGA is required"
      if (!formData.community) stepErrors.community = "Community is required"
      if (!formData.residentialAddress) stepErrors.residentialAddress = "Residential address is required"
    }
    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateStep()) return
    if (step < 2) {
      setStep(step + 1)
    } else {
      try {
        await completeKyc(formData)
        setStep(3)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Verify Your Identity
          </motion.h1>
          <motion.p
            className="text-muted-foreground mt-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Complete the verification process to start using all features
          </motion.p>
        </div>

        {/* Progress steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-md">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step > i
                      ? "bg-green-100 text-green-600"
                      : step === i
                        ? "gradient-primary text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > i ? <CheckCircle size={20} /> : step === 3 ? <CheckCircle size={20} /> : i}
                </div>
                <div className="text-xs mt-2 text-center">
                  {i === 1 ? "Personal Info" : i === 2 ? "Address" : "Completed"}
                </div>
                {i < 3 && <div className={`h-1 w-full mt-2 ${step > i ? "bg-primary" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <h2 className="text-base font-semibold mb-4">Personal Information</h2>
                <div className="mb-4">
                  <label className="block mb-1 font-small text-sm" htmlFor="fullName">
                    Full Name (must match with the name on your NIN)
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border bg-white rounded px-3 py-2 text-sm"
                    placeholder="Enter your Full Name"
                  />
                  {errors.fullName && (
                    <div className="text-red-500 text-sm mt-1">{errors.fullName}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="religion">
                    Religion
                  </label>
                  <select
                    id="religion"
                    name="religion"
                    value={formData.religion}
                    onChange={handleSelectChange}
                    className="w-full border bg-white rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select Religion</option>
                    <option value="christianity">Christianity</option>
                    <option value="islam">Islam</option>
                    <option value="traditional">Traditional</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.religion && (
                    <div className="text-red-500 text-sm mt-1">{errors.religion}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="maritalStatus">
                    Marital Status
                  </label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleSelectChange}
                    className="w-full border rounded bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                  {errors.maritalStatus && (
                    <div className="text-red-500 text-sm mt-1">{errors.maritalStatus}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="dateOfBirth">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full border bg-white rounded px-3 py-2 text-sm"
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={18}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <div className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-small text-sm" htmlFor="nin">
                    NIN
                  </label>
                  <input
                    id="nin"
                    name="nin"
                    type="text"
                    maxLength={11}
                    value={formData.nin}
                    onChange={handleChange}
                    className="w-full border bg-white rounded px-3 py-2 text-sm"
                    placeholder="Enter your 11-digit NIN"
                  />
                  {errors.nin && (
                    <div className="text-red-500 text-sm mt-1">{errors.nin}</div>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-base font-semibold mb-4">Address Information</h2>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="state">
                    State of origin
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleSelectChange}
                    className="w-full border bg-white rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select State</option>
                    {NIGERIA_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <div className="text-red-500 text-sm mt-1">{errors.state}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="lga">
                    LGA
                  </label>
                  <select
                    id="lga"
                    name="lga"
                    value={formData.lga}
                    onChange={handleSelectChange}
                    className="w-full border rounded bg-white px-3 py-2 text-sm"
                    disabled={!selectedState}
                  >
                    <option value="">
                      {selectedState ? "Select LGA" : "Select State first"}
                    </option>
                    {(LGA_BY_STATE[selectedState] || []).map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </select>
                  {errors.lga && (
                    <div className="text-red-500 text-sm mt-1">{errors.lga}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="community">
                    Community
                  </label>
                  <input
                    id="community"
                    name="community"
                    type="text"
                    value={formData.community}
                    onChange={handleChange}
                    className="w-full border bg-white rounded px-3 py-2 text-sm"
                    placeholder="Enter your community"
                  />
                  {errors.community && (
                    <div className="text-red-500 text-sm mt-1">{errors.community}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="residentialAddress">
                    Residential Address
                  </label>
                  <input
                    id="residentialAddress"
                    name="residentialAddress"
                    type="text"
                    value={formData.residentialAddress}
                    onChange={handleChange}
                    className="w-full border bg-white rounded px-3 py-2 text-sm"
                    placeholder="Enter your residential address"
                  />
                  {errors.residentialAddress && (
                    <div className="text-red-500 text-sm mt-1">{errors.residentialAddress}</div>
                  )}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="flex flex-col ml-10 min-h-[60vh] text-center">
                  <div className="max-w-md mr-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2">
                      KYC Created Successfully!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Your kyc has been completed our team will make a review.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={() => router.push("/dashboard")}>
                        Proceed To Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step !== 3 && (
              <div className="flex justify-end pt-4">
                <Button type="submit" className="gradient-primary">
                  {step < 2 ? "Continue" : "Complete Verification"}
                </Button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  )
}
