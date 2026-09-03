import { Link, useRouter } from "@/lib/simple-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  AlertTriangle, Bell, Camera, CheckCircle2, ClipboardList, Download, Eye, FileText,
  HelpCircle, History, ImagePlus, KeyRound, Mail, MessageSquare, Newspaper, Pencil, Phone, Plus, Search,
  Send, ShieldAlert, Smartphone, Store, ThumbsDown, ThumbsUp, Trash2, Upload, User, Users, Video, IdCard,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { toast } from "sonner";
import { syncAppBadgeCount } from "@/lib/app-badge";
import { DashLayout } from "@/components/dashboard/DashLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  CHART_COMPLAINTS_CATEGORY, CHART_DOWNLOADS, CHART_REGISTRATIONS, COMPLAINTS,
  CUSTOMER_KYC, DASHBOARD_STATS, GALLERY_ITEMS, MARKET_UPDATES, MOBILE_REQUESTS, NOTICES, OWNERS,
  type CustomerKyc, type GalleryItem,
} from "@/lib/mock";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

const CHART_COLORS = ["#86c127", "#e37814", "#86c127", "#D92D20", "#7C3AED", "#0284C7"];

const ENGLISH_NAME_FIXES: Array<[string, string]> = [
  ["Gulam", "Ghulam"],
  ["Hsen", "Hussain"],
  ["Hasen", "Hussain"],
  ["Husen", "Hussain"],
  ["Tausiph", "Tausif"],
  ["Tosiph", "Tosif"],
  ["Asso", "Associates"],
  ["Sattaramdas", "Sattaramdas"],
  ["Sttaramdas", "Sattaramdas"],
  ["Gurmukhdas", "Gurmukhdas"],
  ["Nathsaheb", "Nathsaheb"],
  ["Nathasaheb", "Nathsaheb"],
  ["Sndip", "Sandeep"],
  ["Andd", "And"],
  ["Bagvan", "Bagwan"],
  ["Kaci", "Kachi"],
  ["Ursl", "Ursal"],
  ["Jsuja", "Jasuja"],
  ["Dvarkadas", "Dwarkadas"],
  ["Jmjm", "Jamjam"],
  ["Munaph", "Munaf"],
  ["Shekh", "Shaikh"],
  ["Keshvrav", "Keshavrao"],
  ["Naraynn", "Narayan"],
  ["Mohmmd", "Mohammad"],
  ["Mstan", "Mastan"],
  ["Dstgir", "Dastagir"],
  ["Slim", "Salim"],
  ["Bshir", "Bashir"],
  ["Rhemanji", "Rahmanji"],
  ["Abduljbbar", "Abdul Jabbar"],
  ["Pharukh", "Farukh"],
  ["Tosiph", "Tosif"],
  ["Muktar", "Mukhtar"],
  ["Anvr", "Anwar"],
  ["Kasmbhai", "Kasambhai"],
  ["Nsir", "Nasir"],
  ["Prdip", "Pradip"],
  ["Kisnrav", "Kisanrao"],
  ["Ujher", "Uzair"],
  ["ujher", "Uzair"],
  ["Njhir", "Nazir"],
  ["Hcnure", "Hachnure"],
  ["Sidhdarth", "Siddharth"],
  ["Shekhr", "Shekhar"],
  ["Stish", "Satish"],
  ["Shetth", "Sheth"],
  ["Shkrrav", "Shankarrao"],
  ["Dipk", "Dipak"],
  ["Sttaramdas", "Sattaramdas"],
  ["Krmcdani", "Karamchandani"],
  ["Rghunath", "Raghunath"],
  ["Vishvnath", "Vishwanath"],
  ["Mnoj", "Manoj"],
  ["Prdeshi", "Pardeshi"],
  ["Pritmdas", "Pritamdas"],
  ["Shjram", "Sahajram"],
  ["Jysinghani", "Jaisinghani"],
  ["Vijy", "Vijay"],
  ["Vamn", "Vaman"],
  ["Borkr", "Borkar"],
  ["Ttredding", "Trading"],
  ["Es.ke.", "S.K."],
  ["Ddi.bi.", "D.B."],
  ["Ke.ddi.", "K.D."],
  ["Ke.ddi", "K.D."],
  [".rakesh", "Rakesh"],
  [".mgesh", "Mangesh"],
  [".sidhdarth", "Siddharth"],
  [".yuvraj", "Yuvraj"],
  [".ujher", "Uzair"],
  ["Shrimhalkssmi", "Shri Mahalaxmi"],
  ["ursl", "Ursal"],
  ["  ", " "],
];

const REFERENCE_ENGLISH_NAME_WORDS = ["A.B","Aaisaheb","Aarti","Aashirwad","Abaji","Abasaheb","Abdul","Abduljabbar","Abdullah","Abhang","Abhijit","Aditya","Admane","Adsul","Agency","Ahmad","Ajantha","Ajay","Ajit","Ajitkumar","Akash","Akhade","Akrur","Alka","Allabaksh","Altaf","Amar","Ambadas","Amit","Amol","Amrale","Anaji","Ananda","Anandrao","Anant","Ananta","Anantrao","Aniket","Anil","Aniruddha","Ankush","Annasaheb","Anpat","Anwar","Anwarbai","Appa","Apulki","Arif","Arifbhai","Arjun","Arman","Arnav","Arora","Arun","Arunsheth","Arvind","Arya","Aryan","Asha","Ashish","Ashok","Ashokkumar","Ashokrao","Ashwini","Asifali","Associates","Atharva","Atmaram","Atul","Avadhut","Awadaji","Awate","Ayaz","Ayub","Baban","Babanrao","Babaraje","Babasaheb","Babulal","Baburao","Baburde","Badade","Bagwan","Bahiru","Baijukumar","Bajirao","Balaji","Balaram","Balasaheb","Baliram","Balkrishna","Baloba","Balshiram","Balwant","Bamburde","Bandal","Bande","Bandeali","Bangad","Bangi","Bankar","Bansilal","Banwari","Bappuji","Bapu","Bapuji","Bapurao","Bapusaheb","Bashir","Bashirbhai","Belhekar","Bendbhar","Bendre","Bhagwan","Bhagwandas","Bhagwanrao","Bhagwansheth","Bhalchandra","Bhalerao","Bhanudas","Bhapkar","Bharat","Bharati","Bharatsingh","Bhaskar","Bhausaheb","Bhavani","Bhikaji","Bhikoba","Bhilare","Bhimaji","Bhimrao","Bhivrao","Bhoibar","Bhoite","Bhokare","Bholaimata","Bhole","Bhondve","Bhor","Bhorade","Bhorhade","Bhosale","Bhugaji","Bhujbal","Bhuleshwar","Bhushan","Bilal","Birajdar","Bongane","Borkar","Brothers","Buban","Buwaji","Chandarrao","Chandasaheb","Chandrabhaga","Chandrakant","Chandrashekhar","Chandsab","Changdev","Chaudhari","Chaudhary","Chavan","Chetan","Chhagan","Chhaganrao","Chimaji","Chintamani","Chitalkar","Chive","Chorge","Chorghe","Company","Dadabhau","Dadalal","Dadasaheb","Dadubhai","Dagdoba","Dagdu","Dagdubhai","Damodar","Damu","Dande","Dashrath","Dashrathrao","Dasrao","Dastagir","Datir","Datta","Dattakrupa","Dattatray","Dattoba","Datturam","Daulat","Dedge","Deepak","Delhi","Dendge","Deshmukh","Devde","Devgad","Devkar","Devram","Dhage","Dhamale","Dhamdhere","Dhananjay","Dhanesh","Dharamji","Dhondiba","Dhumal","Digambar","Dighe","Dilip","Dilipkumar","Dinanath","Dinesh","Dinkar","Dinkarrao","Dnyandev","Dnyaneshwar","Dnyanoba","Doke","Dudhale","Durgawati","Durge","Durgesh","Durvankur","Dwarkadas","Ekatpure","Eknath","Eknathrao","Faiyaz","Farm","Farooq","Farukh","Firoz","Fruit","Fruits","Gadwe","Gaikwad","Gajanan","Ganesh","Ganeshsheth","Gangaram","Ganibhai","Ganpat","Ganpati","Ganpatrao","Ganraj","Garade","Gaurav","Gautam","Gawade","Gawalgadade","Gaware","Gawshete","Gayatri","Ghadge","Ghare","Ghatge","Ghaus","Ghodekar","Ghodke","Gholap","Ghulam","Ghule","Ginger","Girish","Girme","Gogawale","Gokul","Gokuldas","Gole","Gopichand","Gorakh","Gorakhnath","Gorakshnath","Gore","Gote","Govind","Govindrao","Gulab","Gulabrao","Gulshan","Gulzar","Gund","Gurmukhdas","Gurudev","Gyanba","Gyanchand","Gyanoba","H.B","Hafiz","Hagawane","Haji","Hanif","Hanji","Hannure","Hanumant","Hapus","Harale","Hargude","Hari","Haribhau","Harihar","Harishchandra","Harpale","Harshad","Hashambhai","Hawaldar","Hemlata","Hendre","Hindrao","Hirai","Hiraman","Hole","Honrao","Hrishikesh","HUF","Hussain","I.M","Ibrahim","Iliyas","Inamdar","India","Indubai","Ingale","International","Iyaman","Jadhav","Jafar","Jagadamb","Jagannath","Jagdale","Jagdamba","Jagdish","Jagtap","Jai","Jaihind","Jalindar","Jamge","Janardan","Jarande","Jasuja","Javed","Jawalkar","Jayant","Jayesh","Jayganesh","Jaymalhar","Jaysing","Jaysinghani","Jaysingrao","Jaywant","Jaywantrao","Jesaram","Jhagade","Jidge","Jijaram","Jitendra","Jivraj","Jogeshwar","Joshi","Jotiba","Juman","K.D","Kachi","Kadam","Kailas","Kajale","Kakade","Kakasaheb","Kalashetti","Kalbhor","Kale","Kaluram","Kamal","Kamaltai","Kamlakar","Kamlesh","Kamthe","Kanade","Kanhaiyalal","Kanifnath","Kanpile","Kanta","Kantilal","Kapse","Karale","Karamchandani","Karan","Karim","Kasambhai","Kashinath","Kashiram","Kasim","Katkar","Katke","Kawade","Kedareshwar","Kedari","Kendra","Keshav","Keshavlal","Keshavrao","Keswani","Khaire","Khanderao","Khandu","Khanvilkar","Khatal","Khatate","Khatpe","Khedekar","Khenat","Khengare","Khirid","Khopde","Khudabaksh","Kiran","Kisan","Kisanrao","Kishor","Kolhe","Kolte","Kondaji","Konde","Kondiba","Korde","Korpe","Kripal","Krishiratna","Krishna","Krishnaji","Krushi","Kshirsagar","Kul","Kumar","Kumbharkar","Kunjir","Ladkat","Ladlesaheb","Lalasode","Lalchand","Lata","Late","Lawande","Lawate","Laxman","Laxmanrao","Laxmi","Laxmibai","Laxminarayan","Leela","Lemon","Limbore","Lohokare","Lokhande","Lokumal","Lonkar","Ltd","Lukde","Lukman","Machhindra","Madhavrao","Madhukar","Mahadev","Mahajan","Mahakali","Mahalakshmi","Mahalaxmi","Mahaling","Maharashtra","Mahesh","Maitri","Malai","Mallappa","Malusare","Mandhare","Mane","Manere","Mangala","Mangalmurti","Mangesh","Manikchand","Manikrao","Manisha","Mankar","Manohar","Manoj","Mansing","Mansukh","Mansusab","Manumal","Maratha","Marne","Maruti","Marutrao","Masal","Maskonath","Mastan","Mate","Maulaali","Mauli","Mayur","Mehboob","Mhaske","Mhasku","Mhetre","Milansar","Milind","Minakshi","Minatai","Miss","Modak","Mohammad","Mohan","Mohsin","Mojaddin","Mokashi","Momin","Morde","More","Moreshwar","Motiram","Mujumle","Mukhtar","Muktaji","Mule","Mulla","Munaf","Murlidhar","Nabilal","Nagnath","Namdev","Nana","Nanasaheb","Nanavare","Nanaware","Nanda","Nandini","Nandkumar","Nandu","Narayan","Narayandas","Narayanrao","Narendra","Narsing","Narwade","Nathsaheb","Nathuram","National","Navalde","Navin","Navnath","Nawale","Nazir","Nigade","Nihachand","Nikam","Nikhil","Nilam","Nilesh","Nirmala","Nitin","Nivangune","Nivrutti","Nivruttinath","Niyamatbi","Noor","Omkar","Osama","Oswal","Padmakar","Padmavati","Pailwan","Palande","Panchavati","Pandhare","Pandharinath","Pandit","Pandurang","Pangare","Pangarkar","Pantharam","Parag","Parasram","Pardeshi","Parkale","Parshuram","Parth","Parvati","Parvatrao","Pathare","Patil","Patwardhan","Pawale","Pawar","Pawari","Payari","Paygude","Paymode","Pimple","Pingle","Pisal","Pol","Poman","Poona","Popat","Prabhakar","Pradeep","Prakash","Pralhad","Pranav","Prasad","Prashant","Pratap","Pratapsheth","Prathamesh","Pratik","Pravin","Pritamdas","Pritamsheth","Pruthviraj","Pundalik","Punjabi","Purandar","Pushkaraj","Pvt","Radhakrishna","Rafik","Rafiuddin","Raghoba","Raghunath","Raghuveer","Raheman","Rahim","Rahul","Raikar","Raiphale","Raj","Rajabhau","Rajahmad","Rajaram","Rajashekhar","Rajebhai","Rajendra","Rajesh","Rajgire","Rajiv","Rajkrushniratna","Raju","Rakesh","Rakhnath","Rakshe","Ram","Ramakant","Rambhau","Ramchandra","Ramdas","Ramesh","Ramji","Ramkrishna","Ramling","Rangnath","Ranjana","Ranjeet","Ransing","Raosaheb","Rashid","Raskar","Ratanrao","Rathod","Ratnagiri","Ratnakar","Raut","Ravindra","Ravresh","Rede","Rehmanji","Riddhi","Rishikesh","Ritesh","Ritu","Riyaj","Rizwan","Rohan","Rohidas","Rohit","Rokade","Royal","Rukhmoddin","Rupali","Rupesh","Rutuja","Saaj","Sabir","Sable","Sache","Sachin","Sadashiv","Sadashivrao","Sadhana","Sagar","Sahadev","Sahajram","Sahayog","Sahebrao","Sahyadri","Sai","Sainath","Saipan","Saiprasad","Saisamarth","Sakharam","Sakore","Saleem","Saleembhai","Salim","Sallauddin","Salman","Salunke","Salunkhe","Samarth","Sambhaji","Sambhajirao","Sameer","Sampat","Sampatrao","Sanap","Sanas","Sandeep","Sandesh","Sandeshrao","Sandip","Sangam","Sangeeta","Sanjay","Sanskruti","Sant","Santkrupa","Santosh","Sapkal","Saptashrungi","Sarang","Saraswati","Sarjaram","Sarjerao","Saste","Satav","Satish","Sattaramdas","Satyajit","Saurabh","Savatamali","Savita","Sayyad","Sejal","Seva","Shabbir","Shabu","Shah","Shahabuddin","Shahid","Shaikh","Shailaja","Shambhunath","Shambhuraj","Shamrao","Shankar","Shankarrao","Shankarsingh","Shantaram","Shantilal","Shantling","Sharad","Sharada","Sharda","Shashikant","Shatrughan","Shedge","Shekhar","Shendge","Shendkar","Sheth","Sheti","Shetty","Shewale","Shinde","Shirke","Shitole","Shivaji","Shivajirao","Shivanjali","Shivdarshan","Shivdas","Shivganesh","Shivkrupa","Shivlal","Shivraj","Shivram","Shivsamarth","Shivshakti","Shivshankar","Shoaib","Shravani","Shree","Shri","Shridatta","Shrikant","Shrimant","Shrimantrao","Shrinath","Shripad","Shripati","Shripatrao","Shriram","Shrirang","Shubharambh","Shubharang","Siddharth","Siddharudha","Siddheshwar","Siddhi","Siddhivinayak","Siddhram","Siddhu","Siddiqali","Siraj","Sitaram","Smaran","Solaskar","Someshwar","Somnath","Sonawane","Sonba","Sons","Sopan","Sopanrao","Stall","Subhash","Subhedar","Subodh","Sudam","Sudhakar","Sudhir","Suhas","Sujay","Sukhdev","Sukhraj","Sukre","Suleman","Sunil","Sunita","Suraj","Suresh","Suryakant","Suryawanshi","Sushilkumar","Suvarna","Suvidha","Swagat","Swami","Swapnil","Swati","Syndicates","Taj","Tajmat","Talekar","Tamboli","Tanaji","Tapkir","Tarachand","Tatyaba","Tatyasaheb","Tausif","Tawade","Taware","Tejas","Tejaswi","Thite","Thombre","Thopte","Thorat","Tikhole","Tilekar","Tirupati","Todkar","Tosif","Traders","Trading","Trimbakrao","Trimurti","Tukaimata","Tukaram","Tuljaram","Tulshiram","Tupe","Ulhas","Umang","Umarali","Ursal","Usman","Uttam","Uttreshwar","Uzer","Vaibhav","Vairagkar","Vaishnavi","Vakhare","Valmik","Vandana","Varsha","Vasant","Vasantrao","Vegetable","Venkat","Venkatesh","Vibhute","Vidyadhar","Vighnaharta","Vijay","Vikas","Vikram","Vikrant","Vilas","Vilasrao","Vimal","Vinayak","Vinod","Viraj","Vishal","Vishnu","Vishwanand","Vishwanath","Vithoba","Vitthal","Vitthalrao","Vivek","Vrushali","Vyavhare","Wadkar","Wagasakar","Wagaskar","Waghmode","Waghole","Walchand","Walgude","Walhekar","Waman","Wamanrao","Wanjhe","Ware","Waykar","Yadav","Yallappa","Yash","Yashaswi","Yashraj","Yashwant","Yasin","Yenbhar","Yogesh","Yunus","Yuvraj","Zakir","Zamzam","Zanjad","Zende","Zhite","Zurange"];

function englishNameWordKey(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, "").replace(/[aeiou]/g, "");
}

const REFERENCE_ENGLISH_NAME_KEY_COUNTS = REFERENCE_ENGLISH_NAME_WORDS.reduce<Record<string, number>>((counts, word) => {
  const key = englishNameWordKey(word);
  if (key.length >= 3) counts[key] = (counts[key] || 0) + 1;
  return counts;
}, {});

const REFERENCE_ENGLISH_NAME_WORD_BY_KEY = new Map(
  REFERENCE_ENGLISH_NAME_WORDS
    .map((word) => [englishNameWordKey(word), word] as const)
    .filter(([key]) => key.length >= 3 && REFERENCE_ENGLISH_NAME_KEY_COUNTS[key] === 1),
);

function applyReferenceEnglishWordFixes(value: string) {
  return value
    .split(/(\s+|[\/\-])/)
    .map((part) => {
      if (!/[A-Za-z]/.test(part) || /^[\s\/\-]+$/.test(part)) return part;
      const cleanPart = part.replace(/^\.+|\.+$/g, "");
      const corrected = REFERENCE_ENGLISH_NAME_WORD_BY_KEY.get(englishNameWordKey(cleanPart));
      if (!corrected) return part;
      return part.replace(cleanPart, corrected);
    })
    .join("");
}
const MARATHI_NAME_FIXES: Array<[string, string]> = [
  ["\u0936\u094d\u0930\u0940. .", "\u0936\u094d\u0930\u0940. "],
  ["\u0936\u094d\u0930\u094b.", "\u0936\u094d\u0930\u0940."],
  [".\u0930\u093e\u0915\u0947\u0936", "\u0930\u093e\u0915\u0947\u0936"],
  [".\u092e\u0917\u0947\u0936", "\u092e\u0902\u0917\u0947\u0936"],
  [".\u092e\u0902\u0917\u0947\u0936", "\u092e\u0902\u0917\u0947\u0936"],
  [".\u0938\u093f\u0926\u094d\u0927\u093e\u0930\u094d\u0925", "\u0938\u093f\u0926\u094d\u0927\u093e\u0930\u094d\u0925"],
  [".\u092f\u0941\u0935\u0930\u093e\u091c", "\u092f\u0941\u0935\u0930\u093e\u091c"],
  [".\u0909\u091d\u0947\u0930", "\u0909\u091d\u0947\u0930"],
  ["\u092e\u0917\u0947\u0936", "\u092e\u0902\u0917\u0947\u0936"],
  ["  ", " "],
];

function cleanDisplayEnglish(value: string | null | undefined) {
  let text = String(value || "").trim();
  for (const [from, to] of ENGLISH_NAME_FIXES) text = text.split(from).join(to);
  text = applyReferenceEnglishWordFixes(text);
  return text.replace(/\s+/g, " ").trim();
}

function cleanDisplayMarathi(value: string | null | undefined) {
  let text = String(value || "").trim();
  for (const [from, to] of MARATHI_NAME_FIXES) text = text.split(from).join(to);
  return text.replace(/\s+/g, " ").trim();
}
const DEVANAGARI_TRANSLITERATION: Record<string, string> = {
  "\u0905": "a", "\u0906": "aa", "\u0907": "i", "\u0908": "ee", "\u0909": "u", "\u090a": "oo", "\u090f": "e", "\u0910": "ai", "\u0913": "o", "\u0914": "au",
  "\u0915": "k", "\u0916": "kh", "\u0917": "g", "\u0918": "gh", "\u0919": "n", "\u091a": "ch", "\u091b": "chh", "\u091c": "j", "\u091d": "jh", "\u091e": "ny",
  "\u091f": "t", "\u0920": "th", "\u0921": "d", "\u0922": "dh", "\u0923": "n", "\u0924": "t", "\u0925": "th", "\u0926": "d", "\u0927": "dh", "\u0928": "n",
  "\u092a": "p", "\u092b": "ph", "\u092c": "b", "\u092d": "bh", "\u092e": "m", "\u092f": "y", "\u0930": "r", "\u0932": "l", "\u0933": "l", "\u0935": "v",
  "\u0936": "sh", "\u0937": "sh", "\u0938": "s", "\u0939": "h", "\u0915\u094d\u0937": "ksh", "\u091c\u094d\u091e": "dny",
};

const DEVANAGARI_MATRAS: Record<string, string> = {
  "\u093e": "a", "\u093f": "i", "\u0940": "ee", "\u0941": "u", "\u0942": "oo", "\u0943": "ru", "\u0947": "e", "\u0948": "ai", "\u094b": "o", "\u094c": "au", "\u0902": "n", "\u0901": "n", "\u0903": "h",
};

const DEVANAGARI_WORD_FIXES: Record<string, string> = {
  "shree": "Shri", "shri": "Shri", "me": "M/s.", "and": "And", "company": "Company", "kampanee": "Company", "kanpanee": "Company", "frut": "Fruit", "treding": "Trading", "trading": "Trading", "sons": "Sons", "bradars": "Brothers", "brders": "Brothers", "asosiets": "Associates", "bagwan": "Bagwan", "kachi": "Kachi", "thorat": "Thorat", "shaikh": "Shaikh", "shekh": "Shaikh", "ursal": "Ursal", "jamuja": "Jasuja", "jasuja": "Jasuja", "mangesh": "Mangesh", "rakesh": "Rakesh", "usman": "Usman", "munaf": "Munaf", "ashokkumar": "Ashokkumar", "dwarkadas": "Dwarkadas", "yuvraj": "Yuvraj", "balasaheb": "Balasaheb", "bhanudas": "Bhanudas", "keshavrao": "Keshavrao", "gokul": "Gokul", "sonba": "Sonba", "mohsin": "Mohsin", "gulam": "Ghulam", "ghulam": "Ghulam", "hasen": "Hussain", "husen": "Hussain", "hussain": "Hussain", "rahim": "Rahim", "abdul": "Abdul", "jamjam": "Jamjam",
};

function titleCaseWord(word: string) {
  if (!word) return word;
  const lower = word.toLowerCase();
  return DEVANAGARI_WORD_FIXES[lower] || lower.charAt(0).toUpperCase() + lower.slice(1);
}

function transliterateMarathiToEnglish(value: string | null | undefined) {
  const input = cleanDisplayMarathi(value);
  if (!/[\u0900-\u097F]/.test(input)) return "";
  let output = "";
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    if (char === "\u094d") continue;
    if (DEVANAGARI_MATRAS[char]) {
      output += DEVANAGARI_MATRAS[char];
      continue;
    }
    if (DEVANAGARI_TRANSLITERATION[char]) {
      output += DEVANAGARI_TRANSLITERATION[char];
      if (next && !DEVANAGARI_MATRAS[next] && next !== "\u094d" && /[\u0915-\u0939\u0933]/.test(char)) output += "a";
      continue;
    }
    output += char;
  }
  return output
    .replace(/[\u0964\u0965]/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => /[A-Za-z]/.test(word) ? titleCaseWord(word.replace(/^\.+|\.+$/g, "")) : word)
    .join(" ")
    .replace(/\bM\/s\.?\b/i, "M/s.")
    .replace(/\s+/g, " ")
    .trim();
}
function localizedKycName(lang: string, mrValue: string | null | undefined, enValue?: string | null) {
  return lang === "en" ? cleanDisplayEnglish(enValue || mrValue) : cleanDisplayMarathi(mrValue || enValue);
}
const COMPLAINT_CATEGORIES = [
  { en: "Water Supply", mr: "\u092a\u093e\u0923\u0940 \u092a\u0941\u0930\u0935\u0920\u093e" },
  { en: "Electricity", mr: "\u0935\u0940\u091c \u092a\u0941\u0930\u0935\u0920\u093e" },
  { en: "Cleanliness", mr: "\u0938\u094d\u0935\u091a\u094d\u091b\u0924\u093e" },
  { en: "Garbage / Waste Management", mr: "\u0915\u091a\u0930\u093e \u0935\u094d\u092f\u0935\u0938\u094d\u0925\u093e\u092a\u0928" },
  { en: "Drainage", mr: "\u0938\u093e\u0902\u0921\u092a\u093e\u0923\u0940 / \u0921\u094d\u0930\u0947\u0928\u0947\u091c" },
  { en: "Public Toilet", mr: "\u0938\u093e\u0930\u094d\u0935\u091c\u0928\u093f\u0915 \u0938\u094d\u0935\u091a\u094d\u091b\u0924\u093e\u0917\u0943\u0939" },
  { en: "Parking", mr: "\u0935\u093e\u0939\u0928\u0924\u0933 / \u092a\u093e\u0930\u094d\u0915\u093f\u0902\u0917" },
  { en: "Security", mr: "\u0938\u0941\u0930\u0915\u094d\u0937\u093e" },
  { en: "CCTV / Surveillance", mr: "\u0938\u0940\u0938\u0940\u091f\u0940\u0935\u094d\u0939\u0940 / \u0928\u093f\u0917\u0930\u093e\u0923\u0940" },
  { en: "Street Lights", mr: "\u0930\u0938\u094d\u0924\u094d\u092f\u093e\u0935\u0930\u0940\u0932 \u0926\u093f\u0935\u0947" },
  { en: "Internal Roads", mr: "\u0905\u0902\u0924\u0930\u094d\u0917\u0924 \u0930\u0938\u094d\u0924\u0947" },
  { en: "Road Damage / Potholes", mr: "\u0930\u0938\u094d\u0924\u093e \u0916\u0930\u093e\u092c / \u0916\u0921\u094d\u0921\u0947" },
  { en: "Traffic Management", mr: "\u0935\u093e\u0939\u0924\u0942\u0915 \u0935\u094d\u092f\u0935\u0938\u094d\u0925\u093e\u092a\u0928" },
  { en: "Market Facility", mr: "\u092c\u093e\u091c\u093e\u0930 \u0938\u0941\u0935\u093f\u0927\u093e" },
  { en: "Shop / Gala Issue", mr: "\u0926\u0941\u0915\u093e\u0928 / \u0917\u093e\u0933\u093e \u0938\u092e\u0938\u094d\u092f\u093e" },
  { en: "Gala Number / Record Issue", mr: "\u0917\u093e\u0933\u093e \u0915\u094d\u0930\u092e\u093e\u0902\u0915 / \u0928\u094b\u0902\u0926 \u0938\u092e\u0938\u094d\u092f\u093e" },
  { en: "Encroachment", mr: "\u0905\u0924\u093f\u0915\u094d\u0930\u092e\u0923" },
  { en: "Unauthorized Vendors", mr: "\u0905\u0928\u0927\u093f\u0915\u0943\u0924 \u0935\u093f\u0915\u094d\u0930\u0947\u0924\u0947" },
  { en: "Loading / Unloading Issue", mr: "\u092e\u093e\u0932 \u091a\u0922\u0935\u0923\u0947 / \u0909\u0924\u0930\u0935\u0923\u0947 \u0938\u092e\u0938\u094d\u092f\u093e" },
  { en: "Weighing Scale Issue", mr: "\u0935\u091c\u0928\u0915\u093e\u091f\u093e \u0938\u092e\u0938\u094d\u092f\u093e" },
  { en: "Market Price Issue", mr: "\u092c\u093e\u091c\u093e\u0930\u092d\u093e\u0935 \u0938\u0902\u092c\u0902\u0927\u093f\u0924 \u0938\u092e\u0938\u094d\u092f\u093e" },
  { en: "Drinking Water", mr: "\u092a\u093f\u0923\u094d\u092f\u093e\u091a\u0947 \u092a\u093e\u0923\u0940" },
  { en: "Fire Safety", mr: "\u0905\u0917\u094d\u0928\u093f\u0938\u0941\u0930\u0915\u094d\u0937\u093e" },
  { en: "Stray Animals", mr: "\u092d\u091f\u0915\u0940 \u091c\u0928\u093e\u0935\u0930\u0947" },
  { en: "Pest / Mosquito Problem", mr: "\u0915\u0940\u091f\u0915 / \u0921\u093e\u0938 \u0938\u092e\u0938\u094d\u092f\u093e" },
  { en: "Building / Structure Repair", mr: "\u0907\u092e\u093e\u0930\u0924 / \u092c\u093e\u0902\u0927\u0915\u093e\u092e \u0926\u0941\u0930\u0941\u0938\u094d\u0924\u0940" },
  { en: "Shed / Roof Leakage", mr: "\u0936\u0947\u0921 / \u091b\u0924 \u0917\u0933\u0924\u0940" },
  { en: "Association Office Service", mr: "\u0905\u0938\u094b\u0938\u093f\u090f\u0936\u0928 \u0915\u093e\u0930\u094d\u092f\u093e\u0932\u092f \u0938\u0947\u0935\u093e" },
  { en: "Staff Behaviour", mr: "\u0915\u0930\u094d\u092e\u091a\u093e\u0930\u0940 \u0935\u0930\u094d\u0924\u0923\u0942\u0915" },
  { en: "Member Service Issue", mr: "\u0938\u092d\u093e\u0938\u0926 \u0938\u0947\u0935\u093e \u0938\u092e\u0938\u094d\u092f\u093e" },
  { en: "Mobile App / Portal Issue", mr: "\u092e\u094b\u092c\u093e\u0908\u0932 \u0905\u0945\u092a / \u092a\u094b\u0930\u094d\u091f\u0932 \u0938\u092e\u0938\u094d\u092f\u093e" },
  { en: "Login / Password Issue", mr: "\u0932\u0949\u0917\u093f\u0928 / \u092a\u093e\u0938\u0935\u0930\u094d\u0921 \u0938\u092e\u0938\u094d\u092f\u093e" },
  { en: "Notification Issue", mr: "\u0938\u0942\u091a\u0928\u093e / \u0928\u094b\u091f\u093f\u092b\u093f\u0915\u0947\u0936\u0928 \u0938\u092e\u0938\u094d\u092f\u093e" },
  { en: "Emergency / Safety Issue", mr: "\u0906\u092a\u0924\u094d\u0915\u093e\u0932\u0940\u0928 / \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u0938\u092e\u0938\u094d\u092f\u093e" },
  { en: "Other Complaint", mr: "\u0907\u0924\u0930 \u0924\u0915\u094d\u0930\u093e\u0930" },
];
const COMPLAINT_PRIORITIES = [
  { value: "low", en: "Low", mr: "\u0915\u092e\u0940" },
  { value: "medium", en: "Medium", mr: "\u092e\u0927\u094d\u092f\u092e" },
  { value: "high", en: "High", mr: "\u0909\u091a\u094d\u091a" },
  { value: "urgent", en: "Emergency", mr: "\u0906\u092a\u0924\u094d\u0915\u093e\u0932\u0940\u0928" },
];
const MEMBER_POST_CATEGORIES = [
  "Market Rate Update",
  "Stock Available",
  "Bulk Sale Offer",
  "Fresh Arrival",
  "Gala Announcement",
  "Transport / Loading Help",
  "Payment / Billing Issue",
  "Facility Issue",
  "Lost and Found",
  "General Request",
  "Buyer Requirement",
  "Urgent Buyer Requirement",
  "Wholesale Requirement",
  "Product Requirement",
  "Excess Stock Clearance",
  "Discount / Special Offer",
  "Price Drop Alert",
  "Price Increase Alert",
  "Daily Market Update",
  "Auction / Sale Notice",
  "Vehicle Available",
  "Vehicle Required",
  "Loading Labour Required",
  "Loading Labour Available",
  "Delivery / Transport Delay",
  "Warehouse / Storage Required",
  "Warehouse / Storage Available",
  "Packaging Material Required",
  "Crates / Boxes Required",
  "Crates / Boxes Available",
  "Market Timing Update",
  "Holiday / Market Closure Notice",
  "Weather Alert",
  "Rain / Waterlogging Alert",
  "Traffic / Entry Alert",
  "Parking Update",
  "Security Alert",
  "Electricity Issue",
  "Water Supply Issue",
  "Cleanliness Issue",
  "Drainage Issue",
  "Shop / Gala Maintenance",
  "Association Notice",
  "Meeting Announcement",
  "Member Announcement",
  "Government / APMC Notice",
  "Document / Licence Reminder",
  "Payment Reminder",
  "Emergency Alert",
  "Help Required",
  "Other",
];
const limitDigits = (value: string, maxLength: number) => value.replace(/\D/g, "").slice(0, maxLength);
const limitPan = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
const normalizePan = (value: string) => limitPan(String(value || "").replace(/\\s+/g, ""));
const isValidPan = (value: string) => /^[A-Z]{5}\\d{4}[A-Z]$/.test(normalizePan(value));
const getPanFormatErrorMessage = (lang: "en" | "mr") => lang === "mr" ? "कृपया वैध PAN क्रमांक टाका." : "Please enter a valid PAN number.";
const getPanDuplicateMessage = (lang: "en" | "mr") => lang === "mr" ? "हा PAN क्रमांक आधीच दुसऱ्या ग्राहकासाठी नोंदणीकृत आहे." : "This PAN number is already registered with another customer.";
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];
function isValidAadhaar(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!/^\d{12}$/.test(digits) || /^0{12}$/.test(digits) || /^1{12}$/.test(digits)) return false;
  let checksum = 0;
  [...digits].reverse().forEach((digit, index) => {
    checksum = VERHOEFF_D[checksum][VERHOEFF_P[index % 8][Number(digit)]];
  });
  return checksum === 0;
}
const MOBILE_CHANGE_REASONS = [
  "Lost SIM or phone",
  "Old number is inactive",
  "Changed mobile service provider",
  "Number transferred to family member",
  "Registered number entered incorrectly",
];

function PageTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
      <div className="min-w-0">
        <h1 className="font-display text-xl font-bold leading-tight text-primary-dark sm:text-2xl">{title}</h1>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{subtitle}</p>
      </div>
      {action && <div className="w-full sm:w-auto [&>*]:w-full sm:[&>*]:w-auto">{action}</div>}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
  onClick,
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  tone?: "primary" | "success" | "warning" | "danger" | "saffron";
  onClick?: () => void;
  active?: boolean;
}) {
  const tones = {
    primary: "bg-primary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    danger: "bg-destructive text-white",
    saffron: "bg-saffron text-primary-dark",
  };
  const content = (
    <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl sm:h-12 sm:w-12 ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-display text-xl font-bold text-primary-dark sm:text-2xl">{value}</div>
      </div>
    </CardContent>
  );
  if (onClick) {
    return (
      <Card className={`border-border/60 transition hover:-translate-y-0.5 hover:shadow-md ${active ? "ring-2 ring-primary/40" : ""}`}>
        <button type="button" className="block w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={onClick}>
          {content}
        </button>
      </Card>
    );
  }
  return (
    <Card className="border-border/60">
      {content}
    </Card>
  );
}

function StatusBadge({ status, label }: { status: string; label?: string }) {
  const map: Record<string, string> = {
    approved: "bg-success/15 text-success",
    pending: "bg-warning/15 text-warning",
    rejected: "bg-destructive/15 text-destructive",
    blacklisted: "bg-destructive text-white",
    suspended: "bg-destructive text-white",
    deactivated: "bg-muted text-muted-foreground",
    submitted: "bg-info/15 text-info",
    under_review: "bg-chart-5/15 text-chart-5",
    open: "bg-saffron/20 text-saffron-foreground",
    assigned: "bg-info/15 text-info",
    in_progress: "bg-info/15 text-info",
    waiting_user: "bg-chart-5/15 text-chart-5",
    waiting_info: "bg-saffron/20 text-saffron-foreground",
    resolved: "bg-success/15 text-success",
    closed: "bg-muted text-muted-foreground",
    reshared: "bg-success/15 text-success",
    uploaded: "bg-info/15 text-info",
    verified: "bg-success/15 text-success",
    expired: "bg-muted text-muted-foreground",
    replaced: "bg-muted text-muted-foreground",
  };
  return <Badge className={`inline-flex min-w-max whitespace-nowrap capitalize ${map[status] || "bg-muted text-muted-foreground"}`}>{label || status.replace(/_/g, " ")}</Badge>;
}

const complaintStatusTriggerClasses: Record<string, string> = {
  open: "border-saffron/50 bg-saffron/15 text-saffron-foreground",
  in_progress: "border-info/50 bg-info/15 text-info",
  waiting_user: "border-chart-5/50 bg-chart-5/15 text-chart-5",
  resolved: "border-success/50 bg-success/15 text-success",
  closed: "border-muted bg-muted text-muted-foreground",
};

function SearchBar({ placeholder = "Search..." }: { placeholder?: string }) {
  return (
    <div className="relative min-w-0 flex-1 basis-full sm:min-w-[220px]">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="pl-9" placeholder={placeholder} />
    </div>
  );
}

export function AdminUsersPage() {
  type ManagedTrader = {
    id: number;
    trader_code: string;
    business_name: string;
    business_name_en?: string | null;
    market_registration_number: string | null;
    full_name: string;
    full_name_en?: string | null;
    mobile: string;
    email: string | null;
    verification_status: string;
    user_status: string;
    gala_number: string | null;
    business_category: string | null;
    association_sequence_number?: string | null;
    association_registration_number?: string | null;
    aadhaar_masked?: string | null;
    pan_masked?: string | null;
    blood_group?: string | null;
    licence_number?: string | null;
    district: string;
    village_city?: string | null;
    address_line1?: string | null;
    address_line2?: string | null;
    taluka?: string | null;
    pincode?: string | null;
    rejection_reason?: string | null;
    created_at?: string | null;
    verified_at: string | null;
  };
  type ManagedTraderDocument = {
    id: number;
    document_type: string;
    original_filename: string;
    mime_type: string;
    file_size_bytes: number;
    status: string;
    created_at: string;
    rejection_reason: string | null;
    verified_at: string | null;
    created_at: string;
  };
  type TraderStatusCount = { verification_status: string; count: number | string };
  const [traders, setTraders] = useState<ManagedTrader[]>([]);
  const [traderStats, setTraderStats] = useState<TraderStatusCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTrader, setSelectedTrader] = useState<ManagedTrader | null>(null);
  const [selectedTraderDocuments, setSelectedTraderDocuments] = useState<ManagedTraderDocument[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [accessDialogTrader, setAccessDialogTrader] = useState<ManagedTrader | null>(null);
  const [accessReason, setAccessReason] = useState("");
  const [accessSaving, setAccessSaving] = useState(false);
  const { lang } = useI18n();
  const memberName = (trader: Pick<ManagedTrader, "full_name" | "full_name_en"> | null | undefined) =>
    localizedKycName(lang, trader?.full_name, trader?.full_name_en);
  const businessName = (trader: Pick<ManagedTrader, "business_name" | "business_name_en"> | null | undefined) =>
    localizedKycName(lang, trader?.business_name, trader?.business_name_en);

  const loadTraders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "all" });
      if (search.trim()) params.set("search", search.trim());
      const response = await fetch(`/api/v1/admin/traders?${params.toString()}`, {
        credentials: "include",
      });
      const result = await response.json();
      if (response.status === 401 || response.status === 403) {
        throw new Error("Admin session expired. Please sign in to Admin Hub again.");
      }
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not load Members");
      setTraders(result.traders);
      setTraderStats(result.stats || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load Members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTraders();
  }, []);

  const statusCount = (statuses: string[]) =>
    traderStats
      .filter((item) => statuses.includes(item.verification_status))
      .reduce((total, item) => total + Number(item.count || 0), 0);
  const stats = traderStats.length > 0 ? {
    total: traderStats.reduce((total, item) => total + Number(item.count || 0), 0),
    approved: statusCount(["approved"]),
    pending: statusCount(["submitted", "under_review", "correction_required"]),
    rejected: statusCount(["rejected"]),
    suspended: statusCount(["suspended", "deactivated"]),
  } : {
    total: traders.length,
    approved: traders.filter((item) => item.verification_status === "approved").length,
    pending: traders.filter((item) => ["submitted", "under_review", "correction_required"].includes(item.verification_status)).length,
    rejected: traders.filter((item) => item.verification_status === "rejected").length,
    suspended: traders.filter((item) => ["suspended", "deactivated"].includes(item.verification_status)).length,
  };

  const visibleTraders = traders.filter((item) => {
    if (statusFilter === "pending") return ["submitted", "under_review", "correction_required"].includes(item.verification_status);
    if (statusFilter === "suspended") return ["suspended", "deactivated"].includes(item.verification_status);
    if (statusFilter === "all") return true;
    return item.verification_status === statusFilter;
  });

  const openTraderDetails = async (trader: ManagedTrader) => {
    setSelectedTrader(trader);
    setSelectedTraderDocuments([]);
    setDetailLoading(true);
    try {
      const response = await fetch(`/api/v1/admin/traders/${trader.id}`, { credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not load Member details");
      setSelectedTrader(result.trader);
      setSelectedTraderDocuments(result.documents || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load Member details");
    } finally {
      setDetailLoading(false);
    }
  };

  const detailRows = selectedTrader ? [
    ["Member code", selectedTrader.trader_code],
    ["Full name", memberName(selectedTrader)],
    ["Business name", businessName(selectedTrader)],
    ["Mobile", selectedTrader.mobile],
    ["Email", selectedTrader.email || "-"],
    ["Gala", selectedTrader.gala_number || "-"],
    ["Anu. kramank", selectedTrader.association_sequence_number || "-"],
    ["Kramank", selectedTrader.association_registration_number || "-"],
    ["Category", selectedTrader.business_category || "-"],
    ["License / registration", selectedTrader.market_registration_number || "-"],
    ["Licence number", selectedTrader.licence_number || "-"],
    ["Aadhaar", selectedTrader.aadhaar_masked || "-"],
    ["PAN", selectedTrader.pan_masked || "-"],
    ["Blood group", selectedTrader.blood_group || "-"],
    ["Address", [selectedTrader.address_line1, selectedTrader.address_line2].filter(Boolean).join(", ") || "-"],
    ["Location", [selectedTrader.village_city, selectedTrader.taluka, selectedTrader.district, selectedTrader.pincode].filter(Boolean).join(", ") || "-"],
    ["User status", selectedTrader.user_status],
    ["Verification status", selectedTrader.verification_status],
    ["Applied on", selectedTrader.created_at ? new Date(selectedTrader.created_at).toLocaleString("en-IN") : "-"],
    ["Approved on", selectedTrader.verified_at ? new Date(selectedTrader.verified_at).toLocaleString("en-IN") : "-"],
    ["Remarks", selectedTrader.rejection_reason || "-"],
  ] : [];

  const downloadTraderDocument = (document: ManagedTraderDocument) => {
    const link = window.document.createElement("a");
    link.href = `/api/v1/admin/trader-documents/${document.id}/download?download=1`;
    link.download = document.original_filename;
    window.document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadAllTraderDocuments = () => {
    if (selectedTraderDocuments.length === 0) {
      toast.error("No documents available for this Member");
      return;
    }
    selectedTraderDocuments.forEach((document, index) => {
      window.setTimeout(() => downloadTraderDocument(document), index * 250);
    });
    toast.success("Document downloads started");
  };

  const updateTraderAccess = async (action: "suspend" | "reactivate") => {
    if (!accessDialogTrader) return;
    if (action === "suspend" && accessReason.trim().length < 5) {
      toast.error("Add a clear reason before blocking login.");
      return;
    }
    setAccessSaving(true);
    try {
      const response = await fetch(`/api/v1/admin/traders/${accessDialogTrader.id}/${action}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          remarks: action === "suspend" ? accessReason.trim() : "Access restored by admin",
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not update Member access");
      toast.success(action === "suspend" ? "Member login blocked strictly." : "Member login restored.");
      setAccessDialogTrader(null);
      setAccessReason("");
      await loadTraders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update Member access");
    } finally {
      setAccessSaving(false);
    }
  };

  return (
    <DashLayout kind="admin">
      <PageTitle title="Member Management" subtitle="Search, verify, approve, reject, suspend, and manage all Member accounts." action={<Button variant="outline" onClick={loadTraders}>Refresh</Button>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Members" value={stats.total} />
        <StatCard icon={CheckCircle2} label="Approved" value={stats.approved} tone="success" />
        <StatCard icon={ClipboardList} label="Pending" value={stats.pending} tone="warning" />
        <StatCard icon={ShieldAlert} label="Rejected / suspended" value={stats.rejected + stats.suspended} tone="danger" />
      </div>
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative min-w-0 flex-1 sm:min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search by name, gala, mobile..." value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") loadTraders(); }} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><Download className="mr-1 h-4 w-4" /> Export</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Member</TableHead><TableHead>Contact</TableHead><TableHead>Gala</TableHead><TableHead>Category</TableHead><TableHead className="whitespace-nowrap">Status</TableHead><TableHead className="whitespace-nowrap">Approved</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {visibleTraders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.trader_code}</TableCell>
                    <TableCell><div className="font-medium">{memberName(o)}</div><div className="text-xs text-muted-foreground">{businessName(o)}</div></TableCell>
                    <TableCell><div>{o.mobile}</div><div className="text-xs text-muted-foreground">{o.email}</div></TableCell>
                    <TableCell><Badge variant="outline">{o.gala_number || "-"}</Badge></TableCell>
                    <TableCell>{o.business_category || "-"}</TableCell>
                    <TableCell className="min-w-24 whitespace-nowrap"><StatusBadge status={o.verification_status} /></TableCell>
                    <TableCell className="min-w-24 whitespace-nowrap">{o.verified_at ? new Date(o.verified_at).toLocaleDateString("en-IN") : "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => openTraderDetails(o)}><Eye className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => { setAccessDialogTrader(o); setAccessReason(""); }}><ShieldAlert className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!loading && visibleTraders.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No Members found for this view.</div>}
            {loading && <div className="py-8 text-center text-sm text-muted-foreground">Loading Members from database...</div>}
          </div>
        </CardContent>
      </Card>
      <Dialog open={!!selectedTrader} onOpenChange={(open) => !open && setSelectedTrader(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-primary-dark">{memberName(selectedTrader) || "Member details"}</DialogTitle>
            <DialogDescription>{businessName(selectedTrader) || "Database Member profile"}</DialogDescription>
          </DialogHeader>
          {selectedTrader && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={selectedTrader.verification_status} />
                <Badge variant="outline">{selectedTrader.trader_code}</Badge>
                <Badge variant="outline">Gala {selectedTrader.gala_number || "-"}</Badge>
                <Button size="sm" variant="outline" onClick={downloadAllTraderDocuments} disabled={detailLoading || selectedTraderDocuments.length === 0}>
                  <Download className="mr-1 h-4 w-4" /> Download all documents
                </Button>
                {detailLoading && <span className="text-sm text-muted-foreground">Refreshing details...</span>}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {detailRows.map(([label, value]) => (
                  <div key={label} className="rounded-lg border bg-secondary/30 p-3">
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="mt-1 break-words text-sm font-medium text-primary-dark">{value}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-semibold text-primary-dark">Member Documents</h3>
                    <p className="text-xs text-muted-foreground">View or download uploaded registration documents.</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={downloadAllTraderDocuments}>
                    <Download className="mr-1 h-4 w-4" /> Download all
                  </Button>
                </div>
                <div className="mt-3 overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead className="w-44">Type</TableHead><TableHead>File</TableHead><TableHead className="w-28 text-center">Status</TableHead><TableHead className="w-28 text-center">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {selectedTraderDocuments.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell className="whitespace-nowrap capitalize">{document.document_type.replace(/_/g, " ")}</TableCell>
                          <TableCell className="min-w-0">
                            <div className="max-w-[260px] truncate font-medium">{document.original_filename}</div>
                            <div className="text-xs text-muted-foreground">{Math.max(1, Math.round(document.file_size_bytes / 1024))} KB</div>
                          </TableCell>
                          <TableCell className="text-center"><span className="inline-flex whitespace-nowrap"><StatusBadge status={document.status} /></span></TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => window.open(`/api/v1/admin/trader-documents/${document.id}/download`, "_blank")}><Eye className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => downloadTraderDocument(document)}><Download className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {selectedTraderDocuments.length === 0 && <TableRow><TableCell colSpan={4} className="py-6 text-center text-sm text-muted-foreground">No uploaded documents found for this Member.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!accessDialogTrader} onOpenChange={(open) => { if (!open) setAccessDialogTrader(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-primary-dark">Member Access Control</DialogTitle>
            <DialogDescription>
              {accessDialogTrader?.verification_status === "approved"
                ? "Block this Member login immediately and store the reason in the database."
                : "Review this Member account status or restore access if the issue is resolved."}
            </DialogDescription>
          </DialogHeader>
          {accessDialogTrader && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-secondary/30 p-3 text-sm">
                <div className="font-semibold text-primary-dark">{memberName(accessDialogTrader)}</div>
                <div className="text-muted-foreground">{businessName(accessDialogTrader)} - {accessDialogTrader.trader_code}</div>
                <div className="mt-2"><StatusBadge status={accessDialogTrader.verification_status} /></div>
              </div>
              {accessDialogTrader.verification_status === "approved" && (
                <div>
                  <Label>Reason for blocking login</Label>
                  <Textarea
                    value={accessReason}
                    onChange={(event) => setAccessReason(event.target.value)}
                    rows={4}
                    placeholder="Example: Fake document uploaded, payment fraud, misconduct, duplicate gala claim..."
                  />
                </div>
              )}
              <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
                <Button variant="outline" onClick={() => setAccessDialogTrader(null)} disabled={accessSaving}>Cancel</Button>
                {accessDialogTrader.verification_status === "approved" ? (
                  <Button variant="destructive" onClick={() => updateTraderAccess("suspend")} disabled={accessSaving}>
                    <ShieldAlert className="mr-1 h-4 w-4" /> Block Login
                  </Button>
                ) : (
                  <Button className="bg-success text-white" onClick={() => updateTraderAccess("reactivate")} disabled={accessSaving}>
                    <CheckCircle2 className="mr-1 h-4 w-4" /> Restore Access
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashLayout>
  );
}

export function AdminRegistrationsPage() {
  type PendingTrader = {
    id: number;
    trader_code: string;
    business_name: string;
    business_name_en?: string | null;
    gala_id: number | null;
    full_name: string;
    full_name_en?: string | null;
    mobile: string;
    email: string | null;
    verification_status: string;
    market_registration_number?: string | null;
    association_sequence_number?: string | null;
    association_registration_number?: string | null;
    aadhaar_masked?: string | null;
    pan_masked?: string | null;
    blood_group?: string | null;
    licence_number?: string | null;
    village_city: string;
    district: string;
    created_at: string;
    pending_gala_count?: number;
  };
  type TraderDocument = {
    id: number;
    document_type: string;
    original_filename: string;
    mime_type: string;
    file_size_bytes: number;
    status: string;
    rejection_reason: string | null;
    verified_at: string | null;
    created_at: string;
  };
  type TraderHistory = {
    id: number;
    old_status: string | null;
    new_status: string;
    remarks: string | null;
    created_at: string;
  };
  type TraderGala = {
    id: number;
    business_name: string;
    business_name_en?: string | null;
    market_section: string | null;
    market_registration_number: string | null;
    status: string;
    is_primary: number | boolean;
    admin_remarks: string | null;
    gala_number: string;
    business_category: string | null;
  };
  type ApplicationDetails = {
    application: PendingTrader;
    documents: TraderDocument[];
    history: TraderHistory[];
    galas: TraderGala[];
  };

  const [pending, setPending] = useState<PendingTrader[]>([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<ApplicationDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const { lang } = useI18n();
  const memberName = (trader: Pick<PendingTrader, "full_name" | "full_name_en"> | null | undefined) =>
    localizedKycName(lang, trader?.full_name, trader?.full_name_en);
  const businessName = (trader: Pick<PendingTrader, "business_name" | "business_name_en"> | null | undefined) =>
    localizedKycName(lang, trader?.business_name, trader?.business_name_en);
  const galaBusinessName = (gala: Pick<TraderGala, "business_name" | "business_name_en"> | null | undefined) =>
    localizedKycName(lang, gala?.business_name, gala?.business_name_en);

  const loadPending = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/admin/trader-kyc?status=submitted", {
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not load registrations");
      setPending(result.traders);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const decide = async (Member: PendingTrader, decision: "approve" | "reject") => {
    try {
      const response = await fetch(
        decision === "approve"
          ? `/api/v1/admin/trader-requests/${Member.id}/approve`
          : `/api/v1/admin/trader-requests/${Member.id}/reject`,
        {
          method: "PATCH",
          credentials: "include",
          headers: decision === "approve" ? undefined : { "Content-Type": "application/json" },
          body: decision === "approve" ? undefined : JSON.stringify({ remarks: "Rejected by admin" }),
        },
      );
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Decision failed");
      toast.success(`${Member.full_name} ${decision === "approve" ? "approved" : "rejected"}`);
      loadPending();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Decision failed");
    }
  };

  const loadDetails = async (Member: PendingTrader) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`/api/v1/admin/trader-requests/${Member.trader_code}`, {
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not load application details");
      setDetails({ application: result.application, documents: result.documents || [], history: result.history || [], galas: result.galas || [] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load application details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const decideDocument = async (document: TraderDocument, decision: "verify" | "reject") => {
    const remarks = decision === "reject" ? window.prompt("Reason for rejecting this document?")?.trim() : "";
    if (decision === "reject" && !remarks) {
      toast.error("Rejection reason is required");
      return;
    }
    try {
      const response = await fetch(`/api/v1/admin/trader-documents/${document.id}/decision`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, remarks }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Document decision failed");
      toast.success(`Document ${decision === "verify" ? "verified" : "rejected"}`);
      if (details?.application) await loadDetails(details.application);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Document decision failed");
    }
  };

  const decideGala = async (gala: TraderGala, decision: "approve" | "reject") => {
    const remarks = decision === "reject" ? window.prompt("Reason for rejecting this gala/shop?")?.trim() : "";
    if (decision === "reject" && !remarks) {
      toast.error("Rejection reason is required");
      return;
    }
    try {
      const response = await fetch(`/api/v1/admin/trader-galas/${gala.id}/decision`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, remarks }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Gala/shop decision failed");
      toast.success(`Gala/shop ${decision === "approve" ? "approved" : "rejected"}`);
      if (details?.application) await loadDetails(details.application);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gala/shop decision failed");
    }
  };

  const downloadDocument = (document: TraderDocument) => {
    const link = window.document.createElement("a");
    link.href = `/api/v1/admin/trader-documents/${document.id}/download?download=1`;
    link.download = document.original_filename;
    window.document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <DashLayout kind="admin">
      <PageTitle title="Registration Approvals" subtitle="Review new members and pending gala/shop additions." />
      {loading && <Card className="border-border/60"><CardContent className="p-6 text-sm text-muted-foreground">Loading pending registrations...</CardContent></Card>}
      {!loading && pending.length === 0 && <Card className="border-border/60"><CardContent className="p-6 text-sm text-muted-foreground">No pending Member registrations.</CardContent></Card>}
      <div className="grid gap-4 lg:grid-cols-2">
        {pending.map((o) => (
          <Card key={o.id} className="border-border/60">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-secondary font-display font-bold text-primary">{memberName(o).split(" ").map((p) => p[0]).join("").slice(0, 2)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-primary-dark">{memberName(o)}</h3>
                    <StatusBadge status={o.verification_status} />
                    {Number(o.pending_gala_count || 0) > 0 && <Badge className="bg-saffron text-primary-dark">{o.pending_gala_count} pending gala/shop</Badge>}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{businessName(o)} - {o.trader_code}</div>
                  <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <div><span className="text-muted-foreground">Mobile:</span> {o.mobile}</div>
                    <div><span className="text-muted-foreground">Email:</span> {o.email || "-"}</div>
                    <div><span className="text-muted-foreground">Location:</span> {o.village_city}, {o.district}</div>
                    <div><span className="text-muted-foreground">Applied:</span> {new Date(o.created_at).toLocaleDateString("en-IN")}</div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => loadDetails(o)}><Eye className="mr-1 h-4 w-4" /> View documents</Button>
                    {o.verification_status === "approved" ? (
                      Number(o.pending_gala_count || 0) > 0 && (
                        <Button size="sm" className="bg-saffron text-primary-dark" onClick={() => loadDetails(o)}>
                          <Eye className="mr-1 h-4 w-4" /> Review pending gala/shop
                        </Button>
                      )
                    ) : (
                      <>
                        <Button size="sm" className="bg-success text-white" onClick={() => decide(o, "approve")}><ThumbsUp className="mr-1 h-4 w-4" /> Approve now</Button>
                        <Button size="sm" variant="outline" onClick={() => decide(o, "reject")}><ThumbsDown className="mr-1 h-4 w-4" /> Reject</Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost">Request info</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={!!details} onOpenChange={(open) => !open && setDetails(null)}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-primary-dark">{memberName(details?.application) || "Application review"}</DialogTitle>
            <DialogDescription>{details?.application.trader_code} - registration details and status history</DialogDescription>
          </DialogHeader>
          {detailsLoading && <div className="rounded-lg border p-4 text-sm text-muted-foreground">Loading application details...</div>}
          {details && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Business", businessName(details.application)],
                  ["Mobile", details.application.mobile],
                  ["Email", details.application.email || "-"],
                  ["Anu. kramank", details.application.association_sequence_number || "-"],
                  ["Kramank", details.application.association_registration_number || "-"],
                  ["Licence", details.application.licence_number || details.application.market_registration_number || "-"],
                  ["Aadhaar", details.application.aadhaar_masked || "-"],
                  ["PAN", details.application.pan_masked || "-"],
                  ["Blood group", details.application.blood_group || "-"],
                  ["Location", `${details.application.village_city}, ${details.application.district}`],
                  ["Applied", new Date(details.application.created_at).toLocaleString("en-IN")],
                  ["Status", details.application.verification_status],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border bg-secondary/30 p-3 text-sm">
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="mt-1 font-medium text-primary-dark">{value}</div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-display font-semibold text-primary-dark">Linked Galas / Shops</h3>
                <div className="mt-3 overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader><TableRow><TableHead>Gala</TableHead><TableHead>Business</TableHead><TableHead>Section</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Review</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {details.galas.map((gala) => (
                        <TableRow key={gala.id}>
                          <TableCell>
                            <div className="font-medium">Gala {gala.gala_number}</div>
                            {gala.is_primary ? <div className="text-xs text-primary">Primary shop</div> : null}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{galaBusinessName(gala)}</div>
                            {gala.market_registration_number && <div className="text-xs text-muted-foreground">{gala.market_registration_number}</div>}
                            {gala.admin_remarks && <div className="text-xs text-destructive">{gala.admin_remarks}</div>}
                          </TableCell>
                          <TableCell>{gala.business_category || gala.market_section || "-"}</TableCell>
                          <TableCell><StatusBadge status={gala.status} /></TableCell>
                          <TableCell className="text-right">
                            {["submitted", "under_review", "correction_required"].includes(gala.status) && (
                              <>
                                <Button size="sm" variant="ghost" onClick={() => decideGala(gala, "approve")}><ThumbsUp className="h-4 w-4 text-success" /></Button>
                                <Button size="sm" variant="ghost" onClick={() => decideGala(gala, "reject")}><ThumbsDown className="h-4 w-4 text-destructive" /></Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {details.galas.length === 0 && <TableRow><TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No gala/shop records linked yet.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold text-primary-dark">Uploaded documents</h3>
                <div className="mt-3 overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>File</TableHead><TableHead>Size</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Review</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {details.documents.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell className="capitalize">{document.document_type.replace(/_/g, " ")}</TableCell>
                          <TableCell>
                            <div className="font-medium">{document.original_filename}</div>
                            {document.rejection_reason && <div className="text-xs text-destructive">{document.rejection_reason}</div>}
                          </TableCell>
                          <TableCell>{Math.max(1, Math.round(document.file_size_bytes / 1024))} KB</TableCell>
                          <TableCell><StatusBadge status={document.status} /></TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => window.open(`/api/v1/admin/trader-documents/${document.id}/download`, "_blank")}><Eye className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => downloadDocument(document)}><Download className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => decideDocument(document, "verify")}><ThumbsUp className="h-4 w-4 text-success" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => decideDocument(document, "reject")}><ThumbsDown className="h-4 w-4 text-destructive" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {details.documents.length === 0 && <TableRow><TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No documents uploaded with this application.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold text-primary-dark">Review history</h3>
                <div className="mt-3 space-y-2">
                  {details.history.map((item) => (
                    <div key={item.id} className="rounded-lg border p-3 text-sm">
                      <div className="font-medium text-primary-dark">{item.old_status || "new"} {"->"} {item.new_status}</div>
                      <div className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString("en-IN")}</div>
                      {item.remarks && <div className="mt-1 text-muted-foreground">{item.remarks}</div>}
                    </div>
                  ))}
                  {details.history.length === 0 && <div className="rounded-lg border p-3 text-sm text-muted-foreground">No review history yet.</div>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashLayout>
  );
}

export function AdminComplaintsPage() {
  type AdminComplaint = {
    id: number;
    ticket_number: string;
    subject: string;
    description: string;
    priority: string;
    status: string;
    created_by_name: string;
    created_by_mobile: string;
    gala_number: string | null;
    trader_code: string | null;
    created_at: string;
    updated_at?: string | null;
    assigned_to_user_id?: number | null;
    parsed?: { category?: string; description?: string };
    attachments?: Array<{ id: number; attachment_type: string; original_filename: string; file_size_bytes: number; mime_type?: string | null }>;
  };
  type ComplaintAttachment = NonNullable<AdminComplaint["attachments"]>[number];
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<AdminComplaint | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<ComplaintAttachment | null>(null);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/admin/complaints", { credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not load complaints.");
      setComplaints(result.complaints || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const activeCount = complaints.filter((item) => ["open", "in_progress", "waiting_user"].includes(item.status)).length;
  const resolvedCount = complaints.filter((item) => ["resolved", "closed"].includes(item.status)).length;
  const emergencyCount = complaints.filter((item) => item.priority === "urgent" || item.priority === "emergency").length;
  const priorityOptions = [
    { value: "all", label: "All priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Emergency" },
  ];
  const statusOptions = [
    { value: "all", label: "All statuses" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In progress" },
    { value: "waiting_user", label: "Waiting user" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];
  const statusLabels: Record<string, string> = {
    open: "Open",
    in_progress: "In progress",
    waiting_user: "Waiting user",
    resolved: "Resolved",
    closed: "Closed",
  };
  const priorityLabel = (priority: string) => {
    if (priority === "urgent" || priority === "emergency") return "Emergency";
    return priority ? priority[0].toUpperCase() + priority.slice(1) : "-";
  };
  const priorityClasses = (priority: string) => (
    priority === "urgent" || priority === "emergency"
      ? "bg-destructive text-white"
      : priority === "high"
        ? "bg-warning text-white"
        : priority === "medium"
          ? "bg-saffron/20 text-saffron-foreground"
          : "bg-secondary text-primary-dark"
  );
  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };
  const formatDateTime = (value?: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };
  const attachmentUrl = (file: ComplaintAttachment, download = false) =>
    `/api/v1/admin/complaint-attachments/${file.id}/download${download ? "?download=1" : ""}`;
  const filteredComplaints = complaints.filter((item) => {
    const haystack = [
      item.ticket_number,
      item.subject,
      item.parsed?.category,
      item.parsed?.description,
      item.created_by_name,
      item.created_by_mobile,
      item.trader_code,
      item.gala_number,
    ].filter(Boolean).join(" ").toLowerCase();
    return (!search.trim() || haystack.includes(search.trim().toLowerCase()))
      && (statusFilter === "all" || item.status === statusFilter)
      && (priorityFilter === "all" || item.priority === priorityFilter || (priorityFilter === "urgent" && item.priority === "emergency"));
  });
  const updateComplaintStatus = async (complaint: AdminComplaint, status: string) => {
    const remarks = `Complaint marked ${statusLabels[status] || status} by admin.`;
    try {
      const response = await fetch(`/api/v1/admin/complaints/${complaint.id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, remarks }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not update complaint.");
      toast.success(`${complaint.ticket_number} updated`);
      await loadComplaints();
      setSelectedComplaint((current) => current && current.id === complaint.id ? { ...current, status, updated_at: new Date().toISOString() } : current);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update complaint.");
    }
  };
  const StatusControl = ({ complaint }: { complaint: AdminComplaint }) => (
    <Select value={complaint.status} onValueChange={(status) => updateComplaintStatus(complaint, status)}>
      <SelectTrigger className={`h-9 w-full min-w-[150px] whitespace-nowrap font-semibold ${complaintStatusTriggerClasses[complaint.status] || "border-muted bg-muted text-muted-foreground"}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open" className="font-medium text-saffron-foreground">Open</SelectItem>
        <SelectItem value="in_progress" className="font-medium text-info">In progress</SelectItem>
        <SelectItem value="waiting_user" className="font-medium text-chart-5">Waiting user</SelectItem>
        <SelectItem value="resolved" className="font-medium text-success">Resolved</SelectItem>
        <SelectItem value="closed" className="font-medium text-muted-foreground">Closed</SelectItem>
      </SelectContent>
    </Select>
  );
  const ComplaintPreview = ({ complaint }: { complaint: AdminComplaint }) => (
    <>
      <div className="line-clamp-2 whitespace-normal break-words font-semibold leading-snug text-primary-dark">{complaint.subject}</div>
      <div className="mt-1 line-clamp-2 whitespace-normal break-words text-xs leading-5 text-muted-foreground">
        {complaint.parsed?.category || "General"} - {complaint.parsed?.description || "No description provided."}
      </div>
    </>
  );

  return (
    <DashLayout kind="admin">
      <PageTitle title="Complaint Management" subtitle="Assign, prioritize, comment on, and resolve owner complaints." />
      <AdminComplaintFeedbackPanel />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={MessageSquare} label="Active" value={activeCount} tone="warning" />
        <StatCard icon={CheckCircle2} label="Resolved" value={resolvedCount} tone="success" />
        <StatCard icon={AlertTriangle} label="Emergency" value={emergencyCount} tone="danger" />
        <StatCard icon={ClipboardList} label="Total" value={complaints.length} />
      </div>
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search complaints..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{statusOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{priorityOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <Table className="min-w-[1320px] table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] whitespace-nowrap">ID</TableHead>
                  <TableHead className="w-[430px] whitespace-nowrap">Complaint</TableHead>
                  <TableHead className="w-[170px] whitespace-nowrap">Owner</TableHead>
                  <TableHead className="w-[125px] whitespace-nowrap">Priority</TableHead>
                  <TableHead className="w-[145px] whitespace-nowrap">Status</TableHead>
                  <TableHead className="w-[150px] whitespace-nowrap">Assigned Date</TableHead>
                  <TableHead className="w-[100px] whitespace-nowrap">View</TableHead>
                  <TableHead className="w-[170px] whitespace-nowrap text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((c) => (
                  <TableRow key={c.id} className="align-top">
                    <TableCell className="break-words font-mono text-xs leading-5">{c.ticket_number}</TableCell>
                    <TableCell><ComplaintPreview complaint={c} /></TableCell>
                    <TableCell>
                      <div className="whitespace-normal break-words font-medium leading-snug">{c.created_by_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.gala_number ? `Gala ${c.gala_number} - ${c.trader_code || c.created_by_mobile}` : `Admin - ${c.created_by_mobile}`}
                      </div>
                    </TableCell>
                    <TableCell><Badge className={`inline-flex min-w-20 justify-center whitespace-nowrap rounded-full px-2.5 py-1 ${priorityClasses(c.priority)}`}>{priorityLabel(c.priority)}</Badge></TableCell>
                    <TableCell><span className="whitespace-nowrap"><StatusBadge status={c.status} /></span></TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{formatDate(c.updated_at || c.created_at)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="h-9 whitespace-nowrap" onClick={() => setSelectedComplaint(c)}>
                        <Eye className="mr-1 h-4 w-4" /> View
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusControl complaint={c} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {filteredComplaints.map((c) => (
              <div key={c.id} className="rounded-lg border bg-background p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-mono text-xs text-muted-foreground">{c.ticket_number}</div>
                  <Badge className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 ${priorityClasses(c.priority)}`}>{priorityLabel(c.priority)}</Badge>
                </div>
                <div className="mt-3"><ComplaintPreview complaint={c} /></div>
                <div className="mt-4 grid gap-2 text-sm">
                  <div><span className="text-muted-foreground">Owner:</span> <span className="font-medium">{c.created_by_name}</span></div>
                  <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={c.status} /></div>
                  <div><span className="text-muted-foreground">Date:</span> {formatDate(c.updated_at || c.created_at)}</div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedComplaint(c)}><Eye className="mr-1 h-4 w-4" /> View Complaint</Button>
                  <StatusControl complaint={c} />
                </div>
              </div>
            ))}
          </div>
          {!loading && filteredComplaints.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No complaints found.</div>}
          {loading && <div className="py-8 text-center text-sm text-muted-foreground">Loading complaints...</div>}
        </CardContent>
      </Card>

      <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-hidden p-0">
          {selectedComplaint && (
            <div className="flex max-h-[90vh] flex-col">
              <DialogHeader className="sticky top-0 z-10 border-b bg-background px-6 py-5">
                <DialogTitle className="font-display text-2xl text-primary-dark">Complaint Details</DialogTitle>
                <DialogDescription>{"\u0924\u0915\u094d\u0930\u093e\u0930 \u0924\u092a\u0936\u0940\u0932"} - {selectedComplaint.ticket_number}</DialogDescription>
              </DialogHeader>
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="whitespace-nowrap">{selectedComplaint.parsed?.category || "General"}</Badge>
                  <Badge className={`whitespace-nowrap ${priorityClasses(selectedComplaint.priority)}`}>{priorityLabel(selectedComplaint.priority)}</Badge>
                  <StatusBadge status={selectedComplaint.status} />
                </div>

                <section>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Complaint Subject</div>
                  <h2 className="mt-2 whitespace-normal break-words font-display text-2xl font-bold leading-snug text-primary-dark">{selectedComplaint.subject}</h2>
                </section>

                <section>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</div>
                  <p className="mt-2 whitespace-pre-wrap break-words rounded-lg border bg-secondary/30 p-4 text-sm leading-6 text-foreground">
                    {selectedComplaint.parsed?.description || selectedComplaint.description || "No description provided."}
                  </p>
                </section>

                <section>
                  <h3 className="font-display text-lg font-bold text-primary-dark">Complaint Information</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      ["Submitted by", selectedComplaint.created_by_name],
                      ["Mobile", selectedComplaint.created_by_mobile],
                      ["Owner code", selectedComplaint.trader_code || "-"],
                      ["Gala", selectedComplaint.gala_number || "-"],
                      ["Submitted date", formatDateTime(selectedComplaint.created_at)],
                      ["Assigned date", formatDateTime(selectedComplaint.updated_at || selectedComplaint.created_at)],
                      ["Last updated", formatDateTime(selectedComplaint.updated_at || selectedComplaint.created_at)],
                      ["Assigned to", selectedComplaint.assigned_to_user_id ? "Admin team" : "-"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg border bg-background p-3">
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className="mt-1 whitespace-normal break-words text-sm font-medium text-primary-dark">{value}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="font-display text-lg font-bold text-primary-dark">Evidence / Attachments</h3>
                  <div className="mt-3 grid gap-4">
                    {(selectedComplaint.attachments || []).map((file) => {
                      const isImage = file.attachment_type === "image" || file.mime_type?.startsWith?.("image/");
                      return (
                        <div key={file.id} className="overflow-hidden rounded-lg border bg-background">
                          {isImage ? (
                            <button type="button" className="block w-full bg-secondary/30" onClick={() => setPreviewAttachment(file)}>
                              <img src={attachmentUrl(file)} alt={file.original_filename} className="max-h-[420px] w-full object-contain" />
                            </button>
                          ) : (
                            <div className="grid min-h-40 place-items-center bg-secondary/30 text-sm text-muted-foreground">Video attachment</div>
                          )}
                          <div className="flex flex-wrap items-center justify-between gap-3 p-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-primary-dark">{file.original_filename}</div>
                              <div className="text-xs text-muted-foreground">{file.attachment_type} - {Math.ceil((file.file_size_bytes || 0) / 1024)} KB</div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => window.open(attachmentUrl(file), "_blank")}>View</Button>
                              <Button size="sm" variant="outline" onClick={() => window.open(attachmentUrl(file, true), "_blank")}><Download className="mr-1 h-4 w-4" /> Download</Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {(!selectedComplaint.attachments || selectedComplaint.attachments.length === 0) && (
                      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">No evidence uploaded.</div>
                    )}
                  </div>
                </section>

                <section className="rounded-lg border bg-secondary/30 p-4">
                  <h3 className="font-display text-lg font-bold text-primary-dark">Status / Action</h3>
                  <div className="mt-3 max-w-xs"><StatusControl complaint={selectedComplaint} /></div>
                </section>
              </div>
              <div className="border-t bg-background px-6 py-4 text-right">
                <Button variant="outline" onClick={() => setSelectedComplaint(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewAttachment} onOpenChange={(open) => !open && setPreviewAttachment(null)}>
        <DialogContent className="max-h-[94vh] max-w-6xl p-4">
          {previewAttachment && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-base">{previewAttachment.original_filename}</DialogTitle>
              </DialogHeader>
              <img src={attachmentUrl(previewAttachment)} alt={previewAttachment.original_filename} className="mt-4 max-h-[78vh] w-full rounded-lg object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashLayout>
  );
}

type AdminComplaintFeedback = ComplaintFeedbackRequest & {
  member_name: string;
  member_mobile: string;
  business_name?: string | null;
  gala_number?: string | null;
  trader_code?: string | null;
  reaction?: string | null;
  rating?: number | null;
  comment?: string | null;
  issue_resolution_status?: string | null;
  submitted_at?: string | null;
};

function AdminComplaintFeedbackPanel() {
  const [feedback, setFeedback] = useState<AdminComplaintFeedback[]>([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const filters = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "not_satisfied", label: "Not Satisfied" },
    { value: "reopen_requested", label: "Reopen Requested" },
  ];
  const loadFeedback = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/admin/complaint-feedback?filter=${encodeURIComponent(filter)}`, { credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not load complaint feedback.");
      setFeedback(result.feedback || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load complaint feedback.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadFeedback(); }, [filter]);

  const act = async (item: AdminComplaintFeedback, action: "approve" | "reject" | "reopen-approve" | "reopen-reject") => {
    const needsRemark = action === "reject" || action === "reopen-reject";
    const adminRemark = needsRemark ? window.prompt("Admin remark") || "" : "";
    if (needsRemark && !adminRemark.trim()) return;
    try {
      const response = await fetch(`/api/v1/admin/complaint-feedback/${item.id}/${action}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminRemark }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Action failed.");
      toast.success("Complaint feedback updated.");
      await loadFeedback();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed.");
    }
  };

  const reactionLabel = (value?: string | null) => complaintFeedbackReactions.find((item) => item.value === value)?.en || "-";

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardContent className="p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-primary-dark">Complaint Feedback</h2>
            <p className="text-sm text-muted-foreground">Review member satisfaction, approve feedback, and handle reopen requests.</p>
          </div>
          <Badge className="bg-primary text-white">{feedback.length}</Badge>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map((item) => (
            <Button key={item.value} type="button" size="sm" variant={filter === item.value ? "default" : "outline"} className={filter === item.value ? "bg-saffron text-saffron-foreground hover:bg-saffron/90" : ""} onClick={() => setFilter(item.value)}>{item.label}</Button>
          ))}
        </div>
        {loading ? (
          <div className="rounded-lg border bg-background p-6 text-center text-sm text-muted-foreground">Loading complaint feedback...</div>
        ) : feedback.length === 0 ? (
          <div className="rounded-lg border bg-background p-6 text-center text-sm text-muted-foreground">No complaint feedback found.</div>
        ) : (
          <div className="grid gap-3">
            {feedback.map((item) => (
              <div key={item.id} className="rounded-lg border bg-background p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-muted-foreground">{item.ticket_number} - {item.parsed?.category || "General"}</div>
                    <h3 className="mt-1 font-display font-semibold text-primary-dark">{item.subject}</h3>
                    <div className="mt-1 text-sm text-muted-foreground">{item.member_name} - {item.business_name || item.trader_code || item.member_mobile}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={item.feedback_status} />
                    {Boolean(item.reopen_requested) ? <Badge className="bg-warning text-white">Reopen: {item.reopen_request_status}</Badge> : null}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">Reaction</div><div className="font-semibold text-primary-dark">{reactionLabel(item.reaction)}</div></div>
                  <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">Star Rating</div><div className="font-semibold text-primary-dark">{item.rating ? `${item.rating}/5` : "-"}</div></div>
                  <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">Resolution Status</div><div className="font-semibold text-primary-dark">{(item.issue_resolution_status || "-").replace(/_/g, " ")}</div></div>
                  <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">Submitted</div><div className="font-semibold text-primary-dark">{item.submitted_at ? new Date(item.submitted_at).toLocaleString("en-IN") : "-"}</div></div>
                </div>
                {item.comment && <div className="mt-3 rounded-lg border bg-secondary/20 p-3 text-sm text-muted-foreground">{item.comment}</div>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.feedback_status === "pending" && <Button size="sm" className="bg-saffron text-saffron-foreground hover:bg-saffron/90" onClick={() => act(item, "approve")}>Approve</Button>}
                  {item.feedback_status === "pending" && <Button size="sm" variant="destructive" onClick={() => act(item, "reject")}>Reject</Button>}
                  {Boolean(item.reopen_requested) && item.reopen_request_status === "pending" && <Button size="sm" className="bg-saffron text-primary-dark" onClick={() => act(item, "reopen-approve")}>Approve Reopen</Button>}
                  {Boolean(item.reopen_requested) && item.reopen_request_status === "pending" && <Button size="sm" variant="outline" onClick={() => act(item, "reopen-reject")}>Reject Reopen</Button>}
                  <Button size="sm" variant="outline" onClick={() => window.open("/admin/complaints", "_self")}>Open Complaint</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export function AdminUpdatesPage() {
  const [updates, setUpdates] = useState<DashboardPost[]>([]);
  const [editing, setEditing] = useState<DashboardPost | null>(null);
  const loadUpdates = async () => {
    const response = await fetch("/api/v1/admin/content-posts?kind=updates", { credentials: "include" });
    const result = await response.json();
    if (result.ok) setUpdates(result.posts || []);
  };
  useEffect(() => { loadUpdates(); }, []);
  return (
    <DashLayout kind="admin">
      <PageTitle title="Market Updates" subtitle="Publish daily rates, arrivals, emergency alerts, and general market news." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="space-y-3">
              {updates.map((u) => (
                <div key={u.id} className="flex items-start gap-3 rounded-lg border p-3">
                  {(u.attachments || []).find((file) => file.attachment_type === "image") ? (
                    <img src={`/api/v1/admin/content-attachments/${(u.attachments || []).find((file) => file.attachment_type === "image")?.id}/download`} className="h-16 w-20 shrink-0 rounded-md object-cover" />
                  ) : (
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Newspaper className="h-4 w-4" /></div>
                  )}
                  <div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">{u.parsed?.category || "General"} - {new Date(u.published_at || u.created_at).toLocaleDateString("en-IN")}</div><div className="font-medium text-primary-dark">{u.title_en}</div><p className="mt-1 text-sm text-muted-foreground">{u.parsed?.details || ""}</p><div className="mt-1 text-xs font-semibold text-primary">Visible to {u.share_audience === "category" ? u.share_category_name || "selected category" : "All Members"}</div></div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <Badge className="bg-success/15 text-success">Published</Badge>
                    <Button size="sm" variant="outline" onClick={() => setEditing(u)}><Pencil className="mr-1 h-4 w-4" /> Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => deletePublicPost(u, loadUpdates)}><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
                  </div>
                </div>
              ))}
              {updates.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">No market updates in database yet.</div>}
            </div>
          </CardContent>
        </Card>
        <PublishCard kind="update" onPublished={loadUpdates} />
      </div>
      <PublicPostEditDialog post={editing} kind="update" onClose={() => setEditing(null)} onSaved={loadUpdates} />
    </DashLayout>
  );
}

export function AdminNoticesPage() {
  const [notices, setNotices] = useState<DashboardPost[]>([]);
  const [editing, setEditing] = useState<DashboardPost | null>(null);
  const loadNotices = async () => {
    const response = await fetch("/api/v1/admin/content-posts?kind=notices", { credentials: "include" });
    const result = await response.json();
    if (result.ok) setNotices(result.posts || []);
  };
  useEffect(() => { loadNotices(); }, []);
  return (
    <DashLayout kind="admin">
      <PageTitle title="Notices & Documents" subtitle="Upload circulars, meeting notices, PDFs, images, and video announcements." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <Card className="border-border/60">
          <CardContent className="grid gap-3 p-6 md:grid-cols-2">
            {notices.map((n) => (
              <div key={n.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-2"><Badge variant="outline">{n.parsed?.category || "Notice"}</Badge><span className="text-xs text-muted-foreground">#{n.id}</span></div>
                <h3 className="mt-3 font-display font-semibold text-primary-dark">{n.title_en}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{n.parsed?.details || ""}</p>
                <div className="mt-2 text-xs font-semibold text-primary">Visible to {n.share_audience === "category" ? n.share_category_name || "selected category" : "All Members"}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(n.attachments || []).map((file) => (
                    <Button key={file.id} size="sm" variant="outline" onClick={() => window.open(`/api/v1/admin/content-attachments/${file.id}/download?download=1`, "_blank")}><Download className="mr-1 h-4 w-4" /> {file.original_filename}</Button>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(n)}><Pencil className="mr-1 h-4 w-4" /> Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => deletePublicPost(n, loadNotices)}><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
                </div>
              </div>
            ))}
            {notices.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground md:col-span-2">No notices in database yet.</div>}
          </CardContent>
        </Card>
        <PublishCard kind="notice" onPublished={loadNotices} />
      </div>
      <PublicPostEditDialog post={editing} kind="notice" onClose={() => setEditing(null)} onSaved={loadNotices} />
    </DashLayout>
  );
}

const OWNER_POSTS = [
  {
    id: "POST-101",
    ownerName: "Ramesh Shinde",
    gala: "A-101",
    section: "Vegetable Section A",
    type: "Sale or Availability",
    title: "Fresh tomato stock available",
    body: "Fresh tomato crates are available near Gala A-101 for interested buyers and section owners.",
    status: "submitted",
    date: "2026-07-28",
    images: ["tomato-stock-photo.jpg"],
    videos: ["tomato-stock-walkthrough.mp4"],
  },
  {
    id: "POST-102",
    ownerName: "Suresh Pawar",
    gala: "B-214",
    section: "Onion Section B",
    type: "Market Update",
    title: "Onion arrivals increased today",
    body: "Heavy arrivals in Section B. Please keep the loading lane clear during morning unloading.",
    status: "reshared",
    date: "2026-07-28",
    images: ["onion-arrival-section-b.jpg"],
    videos: ["onion-arrival-video.mp4"],
  },
  {
    id: "POST-103",
    ownerName: "Anil Jadhav",
    gala: "C-032",
    section: "Fruit Section C",
    type: "General Request",
    title: "Extra cleaning required near fruit lane",
    body: "Fruit lane needs extra cleaning after evening closing due to waste near the common walkway.",
    status: "under_review",
    date: "2026-07-27",
    images: ["fruit-lane-cleaning.jpg"],
    videos: [],
  },
];

type PostAttachment = {
  id: number;
  attachment_type: "image" | "video" | "document";
  original_filename: string;
  file_size_bytes?: number;
};

type DashboardPost = {
  id: number;
  post_type: string;
  title_en: string;
  title_mr?: string | null;
  content_en?: string | null;
  content_mr?: string | null;
  status: string;
  created_at: string;
  published_at?: string | null;
  created_by_name?: string;
  business_name?: string | null;
  trader_code?: string | null;
  gala_number?: string | null;
  section_name?: string | null;
  share_audience?: "all" | "category" | string;
  share_category_id?: number | null;
  share_category_name?: string | null;
  parsed?: { category?: string; details?: string };
  parsed_mr?: { category?: string; details?: string };
  attachments?: PostAttachment[];
};

type BusinessCategoryOption = {
  id: number;
  name_en: string;
  name_mr?: string | null;
};

type PublicPostKind = "update" | "notice" | "gallery";

function publicPostType(kind: PublicPostKind) {
  if (kind === "update") return "news";
  if (kind === "notice") return "notice";
  return "gallery";
}

function PostAudienceFields({
  audience,
  setAudience,
  categoryId,
  setCategoryId,
  categories,
}: {
  audience: "all" | "category";
  setAudience: (value: "all" | "category") => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  categories: BusinessCategoryOption[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label>Visible to</Label>
        <Select
          value={audience}
          onValueChange={(value) => {
            setAudience(value as "all" | "category");
            if (value === "all") setCategoryId("");
          }}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Members</SelectItem>
            <SelectItem value="category">Selected category</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {audience === "category" && (
        <div>
          <Label>Member category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {categories.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name_en}{item.name_mr ? ` / ${item.name_mr}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

function PublicPostEditDialog({
  post,
  kind,
  onClose,
  onSaved,
}: {
  post: DashboardPost | null;
  kind: PublicPostKind;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [details, setDetails] = useState("");
  const [audience, setAudience] = useState<"all" | "category">("all");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<BusinessCategoryOption[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!post) return;
    setTitle(post.title_en || "");
    setCategory(post.parsed?.category || (kind === "gallery" ? "Images" : "General"));
    setDetails(post.parsed?.details || post.content_en || "");
    setAudience(post.share_audience === "category" ? "category" : "all");
    setCategoryId(post.share_category_id ? String(post.share_category_id) : "");
  }, [post, kind]);

  useEffect(() => {
    fetch("/api/v1/admin/business-categories", { credentials: "include" })
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) setCategories(result.categories || []);
      })
      .catch(() => undefined);
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!post) return;
    if (audience === "category" && !categoryId) {
      toast.error("Select Member category.");
      return;
    }
    const safeTitle = kind === "gallery" ? title.trim() || post.title_en || "Gallery item" : title.trim();
    const safeCategory = category.trim() || (kind === "gallery" ? "Images" : "General");
    const safeDetails = kind === "gallery" ? details.trim() || "Gallery" : details.trim();
    setSaving(true);
    try {
      const response = await fetch(`/api/v1/admin/posts/${post.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postType: publicPostType(kind),
          titleEn: safeTitle,
          category: safeCategory,
          contentEn: safeDetails,
          status: "published",
          shareAudience: audience,
          shareCategoryId: audience === "category" ? Number(categoryId) : null,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Update failed");
      toast.success("Website content updated");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit website content</DialogTitle>
          <DialogDescription>Changes appear on the public website immediately after saving.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <div><Label>Title</Label><Input value={title} onChange={(event) => setTitle(event.target.value)} required={kind !== "gallery"} /></div>
          <div><Label>{kind === "gallery" ? "Section / media type" : "Category"}</Label><Input value={category} onChange={(event) => setCategory(event.target.value)} required /></div>
          <div><Label>{kind === "gallery" ? "Section / event details" : "Description"}</Label><Textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={5} required={kind !== "gallery"} /></div>
          {kind !== "gallery" && (
            <PostAudienceFields audience={audience} setAudience={setAudience} categoryId={categoryId} setCategoryId={setCategoryId} categories={categories} />
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-saffron text-saffron-foreground hover:bg-saffron/90" disabled={saving}>{saving ? "Saving..." : "Update"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

async function deletePublicPost(post: DashboardPost, onDeleted: () => void | Promise<void>) {
  if (!window.confirm(`Delete "${post.title_en}" from the public website?`)) return;
  try {
    const response = await fetch(`/api/v1/admin/posts/${post.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Delete failed");
    toast.success("Website content deleted");
    await onDeleted();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Delete failed");
  }
}

function postStatusLabel(status: string) {
  if (status === "draft" || status === "scheduled") return "submitted";
  if (status === "published") return "reshared";
  if (status === "archived") return "rejected";
  return status;
}

function MediaDownloads({ attachments = [], downloadBase }: { attachments?: PostAttachment[]; downloadBase: string }) {
  const files = [
    ...attachments.map((file) => ({
      file,
      type: file.attachment_type === "image" ? "Image" : file.attachment_type === "video" ? "Video" : "Document",
      icon: file.attachment_type === "image" ? Camera : file.attachment_type === "video" ? Video : FileText,
    })),
  ];

  if (files.length === 0) return null;

  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {files.map(({ file, type, icon: Icon }) => (
        <Button key={file.id} size="sm" variant="outline" className="h-auto min-w-0 justify-start py-2" onClick={() => window.open(`${downloadBase}/${file.id}/download?download=1`, "_blank")}>
          <Icon className="mr-2 h-4 w-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1 truncate text-left">{file.original_filename}</span>
          <span className="ml-2 shrink-0 text-xs text-muted-foreground">{type}</span>
          <Download className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      ))}
    </div>
  );
}

export function AdminGalleryPage() {
  const [items, setItems] = useState<DashboardPost[]>([]);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [files, setFiles] = useState<File[]>([]);
  const [editing, setEditing] = useState<DashboardPost | null>(null);

  const loadGallery = async () => {
    const response = await fetch("/api/v1/public/gallery");
    const result = await response.json();
    if (result.ok) setItems(result.items || []);
  };

  useEffect(() => { loadGallery(); }, []);

  const imageCount = items.reduce((total, item) => total + (item.attachments || []).filter((file) => file.attachment_type === "image").length, 0);
  const videoCount = items.reduce((total, item) => total + (item.attachments || []).filter((file) => file.attachment_type === "video").length, 0);

  const publishGalleryItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") || "").trim();
    const section = String(data.get("section") || "").trim();

    if (files.length === 0) {
      toast.error("Add at least one image or video");
      return;
    }

    try {
      const attachments = await Promise.all(files.slice(0, 8).map(fileToUploadPayload));
      const fallbackTitle = files[0]?.name?.replace(/\.[^/.]+$/, "") || (mediaType === "image" ? "Gallery image" : "Gallery video");
      const galleryTitle = title || fallbackTitle;
      const gallerySection = section || "Gallery";
      const response = await fetch("/api/v1/admin/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postType: "gallery", titleEn: galleryTitle, contentEn: gallerySection, category: mediaType === "image" ? "Images" : "Videos", attachments, status: "published" }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Gallery publish failed");
      setFiles([]);
      form.reset();
      setMediaType("image");
      toast.success("Gallery item published to database");
      await loadGallery();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gallery publish failed");
    }
  };

  return (
    <DashLayout kind="admin">
      <PageTitle title="Gallery Management" subtitle="Add public gallery images and videos from Main Admin or User Admin dashboard." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Camera} label="Image albums" value={imageCount} />
        <StatCard icon={Video} label="Video albums" value={videoCount} tone="saffron" />
        <StatCard icon={CheckCircle2} label="Published items" value={items.length} tone="success" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="border-saffron/40 bg-saffron/5">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold text-primary-dark">Add gallery media</h2>
            <p className="mt-1 text-sm text-muted-foreground">Upload images or videos and publish them to the public gallery page.</p>
            <form className="mt-5 space-y-4" onSubmit={publishGalleryItem}>
              <div>
                <Label>Gallery title</Label>
                <Input name="title" placeholder="e.g. Annual meeting photos" />
              </div>
              <div>
                <Label>Section / event</Label>
                <Input name="section" placeholder="e.g. Association Hall" />
              </div>
              <div>
                <Label>Media type *</Label>
                <Select value={mediaType} onValueChange={(value) => setMediaType(value as "image" | "video")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 bg-background p-6 text-center text-sm transition hover:border-primary">
                <Upload className="h-7 w-7 text-primary" />
                <span className="font-medium text-primary-dark">
                  Upload {mediaType === "image" ? "images" : "videos"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {mediaType === "image" ? "JPG, PNG, WEBP" : "MP4, WEBM, MOV"} files supported
                </span>
                <input
                  type="file"
                  multiple
                  accept={mediaType === "image" ? "image/*" : "video/*"}
                  className="hidden"
                  onChange={(event) => setFiles(Array.from(event.target.files || []))}
                />
              </label>
              {files.length > 0 && (
                <div className="rounded-lg border bg-background p-3 text-sm">
                  <div className="font-medium text-primary-dark">{files.length} file{files.length > 1 ? "s" : ""} selected</div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {files.slice(0, 4).map((file) => <div key={file.name} className="truncate">{file.name}</div>)}
                    {files.length > 4 && <div>+{files.length - 4} more</div>}
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90">
                <ImagePlus className="mr-1 h-4 w-4" /> Publish to Gallery
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-primary-dark">Published gallery</h2>
                <p className="text-sm text-muted-foreground">These items are visible on the public gallery page.</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/gallery"><Eye className="mr-1 h-4 w-4" /> View Public Gallery</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item, index) => {
                const image = (item.attachments || []).find((file) => file.attachment_type === "image");
                const videos = (item.attachments || []).filter((file) => file.attachment_type === "video");
                return (
                <div key={item.id} className="overflow-hidden rounded-lg border bg-background">
                  <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-secondary/30">
                    {image ? <img src={`/api/v1/public/content-attachments/${image.id}/download`} className="h-full w-full object-contain" /> : <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-background text-primary shadow-md">{videos.length ? <Video className="h-7 w-7" /> : <Camera className="h-7 w-7" />}</div>}
                    <Badge className="absolute left-3 top-3 bg-primary text-white">{videos.length ? "Video" : "Images"}</Badge>
                    {index === 0 && <Badge className="absolute right-3 top-3 bg-saffron text-primary-dark">Latest</Badge>}
                  </div>
                  <div className="p-4">
                    <div className="font-display font-semibold text-primary-dark">{item.title_en}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{item.parsed?.details || ""} - {new Date(item.published_at || item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="outline" className="border-primary/40 text-primary">{(item.attachments || []).length} file(s)</Badge>
                      <Button size="sm" variant="outline" onClick={() => window.open("/gallery", "_blank")}>View</Button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditing(item)}><Pencil className="mr-1 h-4 w-4" /> Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => deletePublicPost(item, loadGallery)}><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
                    </div>
                  </div>
                </div>
              )})}
              {items.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground md:col-span-2">No gallery items in database yet.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
      <PublicPostEditDialog post={editing} kind="gallery" onClose={() => setEditing(null)} onSaved={loadGallery} />
    </DashLayout>
  );
}

function PostMediaPreview({ attachments = [], previewBase = "/api/v1/admin/post-attachments" }: { attachments?: PostAttachment[]; previewBase?: string }) {
  const images = attachments.filter((file) => file.attachment_type === "image");
  const videos = attachments.filter((file) => file.attachment_type === "video");
  const primaryImage = images[0];
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      {primaryImage ? (
        <a href={`${previewBase}/${primaryImage.id}/download`} target="_blank" rel="noreferrer" className="group relative block">
          <div className="grid max-h-[420px] min-h-64 place-items-center bg-secondary/30">
            <img src={`${previewBase}/${primaryImage.id}/download`} alt={primaryImage.original_filename} className="max-h-[420px] w-full object-contain transition group-hover:scale-[1.005]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary-dark shadow">
                  <Camera className="h-3.5 w-3.5 text-primary" /> {images.length} image{images.length === 1 ? "" : "s"}
                </span>
                {videos.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary-dark shadow">
                    <Video className="h-3.5 w-3.5 text-primary" /> {videos.length} video{videos.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>
              <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold shadow">
                <Eye className="h-3.5 w-3.5" /> View image
              </span>
            </div>
          </div>
        </a>
      ) : (
        <div className="grid h-52 place-items-center bg-secondary/40 text-center">
          <div>
            <Camera className="mx-auto h-9 w-9 text-primary" />
            <div className="mt-2 text-sm font-semibold text-primary-dark">No image attached</div>
            <div className="text-xs text-muted-foreground">Images uploaded by Member will appear here.</div>
          </div>
        </div>
      )}
      {videos.length > 0 && !primaryImage && (
        <div className="border-t bg-secondary/20 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary-dark">
            <Video className="h-4 w-4 text-primary" /> Video preview
          </div>
          <div className="grid gap-3">
            {videos.map((file) => (
              <div key={file.id} className="overflow-hidden rounded-md border bg-background">
                <video src={`${previewBase}/${file.id}/download`} controls className="max-h-64 w-full bg-black" />
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs">
                  <span className="min-w-0 flex-1 truncate font-medium text-primary-dark">{file.original_filename}</span>
                  <a href={`${previewBase}/${file.id}/download?download=1`} target="_blank" rel="noreferrer" className="font-semibold text-primary">Download</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SharedPostCard({ post, adminView = false, framed = true }: { post: DashboardPost; adminView?: boolean; framed?: boolean }) {
  const displayStatus = postStatusLabel(post.status);
  const dateValue = post.published_at || post.created_at;
  const ownerName = post.created_by_name || "Member";
  const category = post.parsed?.category || "General Request";
  const details = post.parsed?.details || post.content_en || "";
  const attachmentBase = adminView ? "/api/v1/admin/post-attachments" : "/api/v1/trader/post-attachments";
  const postId = `POST-${String(post.id).padStart(5, "0")}`;
  const visibleTo = post.share_audience === "category" ? (post.share_category_name || "Selected category") : "All Members";
  const postedOn = new Date(dateValue).toLocaleDateString("en-IN");
  const businessInfo = [post.business_name, post.gala_number, post.section_name].filter(Boolean).join(" - ") || "Business details not added";
  const content = (
    <>
      <div className="space-y-3">
        <PostMediaPreview attachments={post.attachments} previewBase={attachmentBase} />

        <article className="rounded-lg border border-primary/15 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span>{postId}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                <span>{postedOn}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                <span>{category}</span>
              </div>
              <h2 className="whitespace-normal break-words font-display text-xl font-bold leading-snug text-primary-dark sm:text-2xl">{post.title_en}</h2>
            </div>
            <StatusBadge status={displayStatus} />
          </div>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">{details}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary-dark">Visible to {visibleTo}</span>
            <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-primary-dark">{displayStatus}</span>
          </div>
        </article>

        <div className="rounded-lg border border-border/70 bg-secondary/20 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase text-muted-foreground">Posted by</div>
              <div className="mt-1 whitespace-normal break-words font-semibold text-primary-dark">{ownerName}</div>
              <div className="mt-0.5 whitespace-normal break-words text-xs text-muted-foreground">{businessInfo}</div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-primary-dark">
              <span className="rounded-full bg-background px-3 py-1">{post.trader_code || "No member code"}</span>
              {adminView && <span className="rounded-full bg-saffron/20 px-3 py-1 text-saffron-foreground">Admin reviewed</span>}
            </div>
          </div>
        </div>

        <MediaDownloads attachments={post.attachments} downloadBase={attachmentBase} />
      </div>
    </>
  );

  if (!framed) return <div>{content}</div>;

  return (
    <Card className="border-border/60">
      <CardContent className="p-6">{content}</CardContent>
    </Card>
  );
}

export function AdminOwnerPostsPage() {
  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [categories, setCategories] = useState<BusinessCategoryOption[]>([]);
  const [shareSettings, setShareSettings] = useState<Record<number, { audience: "all" | "category"; categoryId: string }>>({});
  const [loading, setLoading] = useState(true);
  const pendingPosts = posts.filter((post) => post.status === "draft" || post.status === "scheduled");
  const resharedPosts = posts.filter((post) => post.status === "published");

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/admin/post-queue?status=all", { credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not load Member posts.");
      setPosts(result.posts || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load Member posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    fetch("/api/v1/admin/business-categories", { credentials: "include" })
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) setCategories(result.categories || []);
      })
      .catch(() => undefined);
  }, []);

  const decidePost = async (post: DashboardPost, decision: "approve" | "reject") => {
    const settings = shareSettings[post.id] || { audience: "all", categoryId: "" };
    if (decision === "approve" && settings.audience === "category" && !settings.categoryId) {
      toast.error("Select Member category before resharing.");
      return;
    }
    try {
      const response = await fetch(`/api/v1/admin/posts/${post.id}/decision`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          shareAudience: settings.audience,
          shareCategoryId: settings.audience === "category" ? Number(settings.categoryId) : null,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not update post.");
      const target = settings.audience === "category" ? categories.find((item) => String(item.id) === settings.categoryId)?.name_en || "selected category" : "all Members";
      toast.success(`${post.title_en} ${decision === "approve" ? `reshared to ${target}` : "rejected"}`);
      await loadPosts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update post.");
    }
  };

  const deletePost = async (post: DashboardPost) => {
    if (!window.confirm(`Delete "${post.title_en}" from Member shared posts?`)) return;
    try {
      const response = await fetch(`/api/v1/admin/posts/${post.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not delete post.");
      toast.success(`${post.title_en} removed`);
      await loadPosts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete post.");
    }
  };

  return (
    <DashLayout kind="admin">
      <PageTitle title="Owner Posts" subtitle="Review Member posts and reshare them to all Members or a selected business category." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={ImagePlus} label="Submitted posts" value={posts.length} />
        <StatCard icon={ClipboardList} label="Waiting for review" value={pendingPosts.length} tone="warning" />
        <StatCard icon={Send} label="Reshared posts" value={posts.filter((post) => post.status === "published").length} tone="success" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-primary-dark">Admin review queue</h2>
                <p className="mt-1 text-sm text-muted-foreground">Posts here are visible only to admin until reshared.</p>
              </div>
              <Badge className="bg-saffron text-primary-dark">{pendingPosts.length} pending</Badge>
            </div>
            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <div key={post.id} className="rounded-lg border bg-background p-4">
                  <SharedPostCard post={post} adminView framed={false} />
                  <div className="mt-4 rounded-lg border bg-secondary/25 p-3">
                    <div className="mb-3 text-sm font-semibold text-primary-dark">Share this post to</div>
                    <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
                      <Select
                        value={shareSettings[post.id]?.audience || "all"}
                        onValueChange={(value) => setShareSettings((current) => ({
                          ...current,
                          [post.id]: { audience: value as "all" | "category", categoryId: value === "category" ? current[post.id]?.categoryId || "" : "" },
                        }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Members</SelectItem>
                          <SelectItem value="category">Selected category</SelectItem>
                        </SelectContent>
                      </Select>
                      {(shareSettings[post.id]?.audience || "all") === "category" && (
                        <Select
                          value={shareSettings[post.id]?.categoryId || ""}
                          onValueChange={(value) => setShareSettings((current) => ({
                            ...current,
                            [post.id]: { audience: "category", categoryId: value },
                          }))}
                        >
                          <SelectTrigger><SelectValue placeholder="Select Member category" /></SelectTrigger>
                          <SelectContent>
                            {categories.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name_en}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button className="bg-saffron text-saffron-foreground hover:bg-saffron/90" onClick={() => decidePost(post, "approve")}>
                      <Send className="mr-1 h-4 w-4" /> Reshare Post
                    </Button>
                    <Button variant="outline" onClick={() => decidePost(post, "reject")}>Reject</Button>
                    <Button variant="destructive" onClick={() => deletePost(post)}>
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
              {!loading && pendingPosts.length === 0 && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">No Member posts waiting for review.</div>}
              {loading && <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">Loading Member posts...</div>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <h2 className="font-display font-bold text-primary-dark">Already reshared</h2>
            <p className="mt-1 text-sm text-muted-foreground">These are visible only to the selected Member audience.</p>
            <div className="mt-4 space-y-3">
              {resharedPosts.map((post) => (
                <div key={post.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="outline">{post.parsed?.category || "General Request"}</Badge>
                    <StatusBadge status={postStatusLabel(post.status)} />
                  </div>
                  <div className="mt-2 font-medium text-primary-dark">{post.title_en}</div>
                  <div className="text-xs text-muted-foreground">Posted by {post.created_by_name || "Member"} - Gala {post.gala_number || "-"}</div>
                  <div className="mt-1 text-xs font-semibold text-primary">
                    Visible to {post.share_audience === "category" ? post.share_category_name || "selected category" : "all Members"}
                  </div>
                  <MediaDownloads attachments={post.attachments} downloadBase="/api/v1/admin/post-attachments" />
                  <Button size="sm" variant="destructive" className="mt-3 w-full" onClick={() => deletePost(post)}>
                    <Trash2 className="mr-1 h-4 w-4" /> Delete Post
                  </Button>
                </div>
              ))}
              {!loading && resharedPosts.length === 0 && <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">No decided posts yet.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashLayout>
  );
}

function PublishCard({ kind, onPublished }: { kind: "update" | "notice"; onPublished?: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("General");
  const [audience, setAudience] = useState<"all" | "category">("all");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<BusinessCategoryOption[]>([]);
  useEffect(() => {
    fetch("/api/v1/admin/business-categories", { credentials: "include" })
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) setCategories(result.categories || []);
      })
      .catch(() => undefined);
  }, []);
  const describeFile = (file: File) => {
    if (file.type.startsWith("image/")) return { label: "Image", icon: Camera };
    if (file.type.startsWith("video/")) return { label: "Video", icon: Video };
    return { label: "PDF", icon: FileText };
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const titleEn = String(data.get("titleEn") || "").trim();
    const contentEn = String(data.get("contentEn") || "").trim();
    if (audience === "category" && !categoryId) {
      toast.error("Select Member category.");
      return;
    }

    try {
      const attachments = await Promise.all(files.slice(0, 8).map(fileToUploadPayload));
      const response = await fetch("/api/v1/admin/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postType: kind === "update" ? "news" : "notice",
          titleEn,
          contentEn,
          category,
          attachments,
          status: "published",
          shareAudience: audience,
          shareCategoryId: audience === "category" ? Number(categoryId) : null,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Publish failed");
      toast.success(`${kind === "update" ? "Market update" : "Notice"} published to database`);
      form.reset();
      setFiles([]);
      setCategory("General");
      setAudience("all");
      setCategoryId("");
      onPublished?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Publish failed");
    }
  };

  return (
    <Card className="border-saffron/40 bg-saffron/5">
      <CardContent className="p-6">
        <h2 className="font-display font-bold text-primary-dark">Publish new {kind}</h2>
        <form className="mt-4 space-y-3" onSubmit={submit}>
          <div><Label>Title</Label><Input name="titleEn" required placeholder={kind === "update" ? "Onion price update" : "Meeting notice"} /></div>
          <div><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["General", "Emergency", "Meeting", "Payment", "Water Supply", "Electricity", "Market Holiday", "Rates", "Arrival"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          <PostAudienceFields audience={audience} setAudience={setAudience} categoryId={categoryId} setCategoryId={setCategoryId} categories={categories} />
          <div><Label>Description</Label><Textarea name="contentEn" required rows={4} /></div>
          <label className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm hover:border-primary ${files.length ? "border-success bg-success/10" : "bg-background"}`}>
            <Upload className="h-6 w-6 text-primary" />
            <span className="font-semibold text-primary-dark">{files.length ? `${files.length} file(s) selected` : "Upload image, PDF, or video"}</span>
            <span className="text-xs text-muted-foreground">JPG, PNG, WEBP, PDF, MP4, MOV, WEBM</span>
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf,video/mp4,video/quicktime,video/webm,.pdf,.mov,.mp4,.webm" className="hidden" multiple onChange={(event) => setFiles(Array.from(event.target.files || []))} />
          </label>
          {files.length > 0 && (
            <div className="space-y-2 rounded-lg border bg-background p-3 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-primary-dark">Selected attachments</span>
                <Button type="button" size="sm" variant="ghost" onClick={() => setFiles([])}>Clear</Button>
              </div>
              {files.map((file) => {
                const meta = describeFile(file);
                const Icon = meta.icon;
                return (
                  <div key={`${file.name}-${file.size}`} className="flex min-w-0 items-center gap-2 rounded-md border bg-secondary/20 px-3 py-2">
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="shrink-0 rounded bg-secondary px-2 py-0.5 font-semibold text-primary-dark">{meta.label}</span>
                    <span className="min-w-0 flex-1 truncate text-muted-foreground">{file.name}</span>
                    <span className="shrink-0 text-muted-foreground">{Math.ceil(file.size / 1024)} KB</span>
                  </div>
                );
              })}
            </div>
          )}
          <Button type="submit" className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90">Publish</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function AdminMobileRequestsPage() {
  type MobileChangeRequest = {
    id: number;
    request_code: string;
    trader_name: string;
    trader_code: string;
    gala_number: string | null;
    old_mobile: string;
    new_mobile: string;
    reason: string;
    application_note: string;
    status: string;
    created_at: string;
    documents: Array<{
      id: number;
      document_type: string;
      original_filename: string;
      file_size_bytes: number;
    }>;
  };
  const [requests, setRequests] = useState<MobileChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDecision, setPendingDecision] = useState<{ request: MobileChangeRequest; decision: "approve" | "reject" } | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/admin/mobile-change-requests?status=all", { credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not load mobile change requests.");
      setRequests(result.requests || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load mobile change requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const decideRequest = async () => {
    if (!pendingDecision) return;
    const { request, decision } = pendingDecision;
    const remarks = decision === "reject" ? "Rejected by admin" : "Approved by admin";
    try {
      const response = await fetch(`/api/v1/admin/mobile-change-requests/${request.id}/decision`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, remarks }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Decision failed.");
      toast.success(`${request.request_code} ${decision === "approve" ? "approved" : "rejected"}`);
      setPendingDecision(null);
      await loadRequests();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Decision failed.");
    }
  };

  return (
    <DashLayout kind="admin">
      <PageTitle title="Mobile Change Requests" subtitle="Verify owner identity before updating registered mobile numbers." />
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="overflow-hidden">
            <Table className="w-full table-fixed">
              <TableHeader><TableRow><TableHead className="w-[8%]">ID</TableHead><TableHead className="w-[16%]">Member</TableHead><TableHead className="w-[10%]">Old</TableHead><TableHead className="w-[10%]">New</TableHead><TableHead className="w-[10%]">Reason</TableHead><TableHead className="w-[18%]">Note</TableHead><TableHead className="w-[13%]">Docs</TableHead><TableHead className="w-[9%]">Status</TableHead><TableHead className="w-[6%] text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="break-all font-mono text-[11px] leading-tight">{r.request_code}</TableCell>
                    <TableCell>{r.trader_name}<div className="text-xs text-muted-foreground">Gala {r.gala_number || "-"} - {r.trader_code}</div></TableCell>
                    <TableCell className="whitespace-normal break-all font-mono text-xs">{r.old_mobile}</TableCell>
                    <TableCell className="whitespace-normal break-all font-mono text-xs">{r.new_mobile}</TableCell>
                    <TableCell className="whitespace-normal text-sm leading-snug">{r.reason}</TableCell>
                    <TableCell className="whitespace-normal text-sm leading-snug">{r.application_note}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {r.documents.map((document) => (
                          <Button key={document.id} size="sm" variant="outline" className="h-8 min-w-0 justify-start px-2 text-xs" onClick={() => window.open(`/api/v1/admin/mobile-change-documents/${document.id}/download?download=1`, "_blank")}>
                            <Download className="mr-1 h-3.5 w-3.5 shrink-0" /> <span className="truncate">{document.document_type === "id_proof" ? "ID" : "Mobile"}</span>
                          </Button>
                        ))}
                        {r.documents.length === 0 && <span className="text-xs text-destructive">Missing</span>}
                      </div>
                    </TableCell>
                    <TableCell><span className="inline-flex whitespace-nowrap"><StatusBadge status={r.status} /></span></TableCell>
                    <TableCell className="text-right">
                      {r.status === "pending" ? (
                        <div className="flex flex-col items-end gap-1">
                          <Button size="sm" className="h-8 bg-success px-2 text-xs text-white" onClick={() => setPendingDecision({ request: r, decision: "approve" })}>OK</Button>
                          <Button size="sm" variant="outline" className="h-8 px-2 text-xs" onClick={() => setPendingDecision({ request: r, decision: "reject" })}>No</Button>
                        </div>
                      ) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!loading && requests.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No mobile change requests yet.</div>}
            {loading && <div className="py-8 text-center text-sm text-muted-foreground">Loading requests...</div>}
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={!!pendingDecision} onOpenChange={(open) => !open && setPendingDecision(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingDecision?.decision === "approve" ? "Approve mobile change?" : "Reject mobile change?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm before updating this request. This action will be saved in the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {pendingDecision && (
            <div className="grid gap-3 rounded-lg border bg-secondary/30 p-4 text-sm">
              <div className="font-semibold text-primary-dark">{pendingDecision.request.trader_name}</div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div><span className="text-muted-foreground">Old:</span> <span className="font-mono">{pendingDecision.request.old_mobile}</span></div>
                <div><span className="text-muted-foreground">New:</span> <span className="font-mono">{pendingDecision.request.new_mobile}</span></div>
              </div>
              <div><span className="text-muted-foreground">Reason:</span> {pendingDecision.request.reason}</div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={pendingDecision?.decision === "approve" ? "bg-success text-white hover:bg-success/90" : "bg-destructive text-white hover:bg-destructive/90"}
              onClick={decideRequest}
            >
              {pendingDecision?.decision === "approve" ? "Yes, approve" : "Yes, reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashLayout>
  );
}

type CommitteeMemberRecord = {
  id: number;
  full_name: string;
  name_mr: string | null;
  designation: string;
  designation_mr: string | null;
  gala_number: string | null;
  term_label: string | null;
  message: string | null;
  photo_url: string | null;
  photo_original_filename: string | null;
  display_order: number;
  status: "active" | "inactive";
};

const emptyCommitteeForm = {
  fullName: "",
  nameMr: "",
  designation: "",
  designationMr: "",
  galaNumber: "",
  termLabel: "",
  message: "",
  displayOrder: "100",
  status: "active" as "active" | "inactive",
};

export function AdminCommitteePage() {
  const [members, setMembers] = useState<CommitteeMemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CommitteeMemberRecord | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyCommitteeForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/admin/committee", { credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to load committee members.");
      setMembers(result.members || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load committee members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyCommitteeForm);
    setPhotoFile(null);
    setOpen(true);
  };

  const openEdit = (member: CommitteeMemberRecord) => {
    setEditing(member);
    setForm({
      fullName: member.full_name,
      nameMr: member.name_mr || "",
      designation: member.designation,
      designationMr: member.designation_mr || "",
      galaNumber: member.gala_number || "",
      termLabel: member.term_label || "",
      message: member.message || "",
      displayOrder: String(member.display_order ?? 100),
      status: member.status,
    });
    setPhotoFile(null);
    setOpen(true);
  };

  const saveMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const endpoint = editing ? `/api/v1/admin/committee/${editing.id}` : "/api/v1/admin/committee";
    const method = editing ? "PATCH" : "POST";
    try {
      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          photo: photoFile ? await fileToUploadPayload(photoFile) : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to save committee member.");
      toast.success(editing ? "Committee member updated" : "Committee member added");
      setOpen(false);
      setPhotoFile(null);
      await loadMembers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save committee member.");
    }
  };

  const deleteMember = async (member: CommitteeMemberRecord) => {
    if (!window.confirm(`Delete ${member.full_name} from committee?`)) return;
    try {
      const response = await fetch(`/api/v1/admin/committee/${member.id}`, { method: "DELETE", credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to delete committee member.");
      toast.success("Committee member deleted");
      await loadMembers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete committee member.");
    }
  };

  const initials = (name: string) => name.split(" ").filter(Boolean).slice(-1)[0]?.[0]?.toUpperCase() || name[0]?.toUpperCase() || "M";
  const { lang } = useI18n();
  const displayCommitteeName = (member: CommitteeMemberRecord) => lang === "mr" ? member.name_mr || member.full_name : member.full_name;
  const displayCommitteeDesignation = (member: CommitteeMemberRecord) => lang === "mr" ? member.designation_mr || member.designation : member.designation;

  return (
    <DashLayout kind="admin">
      <PageTitle title="Chairman & Committee" subtitle="Maintain association leadership details shown on the public site." action={<Button onClick={openNew}><Plus className="mr-1 h-4 w-4" /> Add Member</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((m) => (
          <Card key={m.id} className="border-border/60">
            <CardContent className="p-5 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-secondary font-display text-lg font-bold text-primary">
                {m.photo_url ? <img src={m.photo_url} alt={m.full_name} className="h-full w-full object-cover" /> : initials(m.full_name)}
              </div>
              <h3 className="mt-3 font-display font-semibold text-primary-dark">{displayCommitteeName(m)}</h3>
              {lang === "en" && m.name_mr && <div className="mt-0.5 text-xs text-muted-foreground">{m.name_mr}</div>}
              <div className="mt-1 text-sm text-primary">{displayCommitteeDesignation(m)}</div>
              {lang === "en" && m.designation_mr && <div className="text-xs text-muted-foreground">{m.designation_mr}</div>}
              {m.gala_number && <div className="mt-1 text-xs text-muted-foreground">Gala {m.gala_number}</div>}
              {m.term_label && <div className="mt-1 text-xs text-muted-foreground">Term {m.term_label}</div>}
              <Badge className={`mt-3 ${m.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{m.status}</Badge>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(m)}>Edit</Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => deleteMember(m)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && members.length === 0 && (
          <Card className="border-border/60 sm:col-span-2 lg:col-span-4">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">No committee members in database yet.</CardContent>
          </Card>
        )}
        {loading && (
          <Card className="border-border/60 sm:col-span-2 lg:col-span-4">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">Loading committee members...</CardContent>
          </Card>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit committee member" : "Add committee member"}</DialogTitle>
            <DialogDescription>Saved details are shown on the public website.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={saveMember}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Profile photo</Label>
                <label className={`flex min-h-28 cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed p-4 transition hover:border-primary ${photoFile ? "border-success bg-success/10" : "border-border bg-secondary/40 hover:bg-secondary"}`}>
                  <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-background text-primary shadow-sm">
                    {photoFile ? (
                      <img src={URL.createObjectURL(photoFile)} alt="Selected committee member" className="h-full w-full object-cover" />
                    ) : editing?.photo_url ? (
                      <img src={editing.photo_url} alt={editing.full_name} className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="h-6 w-6" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-primary-dark">{photoFile ? "Photo selected" : "Upload member photo"}</div>
                    <div className={`mt-1 max-w-full truncate text-xs ${photoFile ? "font-medium text-success" : "text-muted-foreground"}`}>
                      {photoFile?.name || editing?.photo_original_filename || "JPG, PNG, or WEBP up to 5 MB"}
                    </div>
                    <div className="mt-2 inline-flex rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white">Choose photo</div>
                  </div>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => setPhotoFile(event.target.files?.[0] || null)} />
                </label>
              </div>
              <div className="space-y-2">
                <Label>Full name *</Label>
                <Input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required placeholder="Shri. Full Name" />
              </div>
              <div className="space-y-2">
                <Label>Name in Marathi</Label>
                <Input value={form.nameMr} onChange={(event) => setForm({ ...form, nameMr: event.target.value })} placeholder={"\u092e\u0930\u093e\u0920\u0940 \u0928\u093e\u0935"} />
              </div>
              <div className="space-y-2">
                <Label>Designation *</Label>
                <Input value={form.designation} onChange={(event) => setForm({ ...form, designation: event.target.value })} required placeholder="Chairman, Secretary..." />
              </div>
              <div className="space-y-2">
                <Label>Designation in Marathi</Label>
                <Input value={form.designationMr} onChange={(event) => setForm({ ...form, designationMr: event.target.value })} placeholder={"\u0905\u0927\u094d\u092f\u0915\u094d\u0937, \u0938\u091a\u093f\u0935..."} />
              </div>
              <div className="space-y-2">
                <Label>Gala number</Label>
                <Input value={form.galaNumber} onChange={(event) => setForm({ ...form, galaNumber: event.target.value })} placeholder="A-101" />
              </div>
              <div className="space-y-2">
                <Label>Term</Label>
                <Input value={form.termLabel} onChange={(event) => setForm({ ...form, termLabel: event.target.value })} placeholder="2026-2031" />
              </div>
              <div className="space-y-2">
                <Label>Display order</Label>
                <Input type="number" value={form.displayOrder} onChange={(event) => setForm({ ...form, displayOrder: event.target.value })} min={1} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as "active" | "inactive" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active - show publicly</SelectItem>
                    <SelectItem value="inactive">Inactive - hide publicly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Message / introduction</Label>
              <Textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Chairman message or member introduction" rows={4} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-saffron text-saffron-foreground hover:bg-saffron/90">Save Member</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashLayout>
  );
}

type ReportAnalytics = {
  summary: {
    portal_logins_30d?: number;
    downloadable_files?: number;
    file_downloads?: number;
    resolved_complaints?: number;
    active_complaints?: number;
    emergency_complaints?: number;
    published_notices?: number;
    total_traders?: number;
    approved_traders?: number;
    pending_traders?: number;
    rejected_traders?: number;
    suspended_traders?: number;
    published_content?: number;
    pwa_installs_total?: number;
    pwa_installs_today?: number;
    pwa_installs_week?: number;
    pwa_installs_month?: number;
    pwa_installs_registered_users?: number;
    pwa_installs_mobile?: number;
    pwa_installs_desktop?: number;
    pwa_installs_other?: number;
    generated_at?: string;
    current_month_label?: string;
    current_month_start?: string;
    current_month_end?: string;
    monthly_logins?: number;
    monthly_file_downloads?: number;
    monthly_pwa_installs?: number;
    monthly_complaints_received?: number;
    monthly_complaints_resolved?: number;
    monthly_posts_created?: number;
    monthly_posts_published?: number;
    monthly_notices_published?: number;
    monthly_registrations?: number;
    monthly_approved_registrations?: number;
    monthly_customer_kyc_submitted?: number;
    monthly_customer_kyc_verified?: number;
    monthly_market_prices_published?: number;
    monthly_mobile_change_requests?: number;
    monthly_mobile_change_approved?: number;
  };
  charts: {
    registrations: Array<{ month: string; count: number }>;
    downloads: Array<{ month: string; downloads: number }>;
    pwaInstalls: Array<{ month: string; installs: number }>;
    pwaPlatforms: Array<{ platform: string; count: number }>;
    complaintsByCategory: Array<{ category: string; count: number }>;
    complaintsByStatus: Array<{ status: string; count: number }>;
    contentByStatus: Array<{ status: string; count: number }>;
  };
};

const emptyReportAnalytics: ReportAnalytics = {
  summary: {},
  charts: {
    registrations: [],
    downloads: [],
    pwaInstalls: [],
    pwaPlatforms: [],
    complaintsByCategory: [],
    complaintsByStatus: [],
    contentByStatus: [],
  },
};

export function AdminReportsPage() {
  const [analytics, setAnalytics] = useState<ReportAnalytics>(emptyReportAnalytics);
  const [loading, setLoading] = useState(true);
  const [lastLoadedAt, setLastLoadedAt] = useState<Date | null>(null);

  const loadAnalytics = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const response = await fetch("/api/v1/admin/reports/analytics", { credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to load reports.");
      setAnalytics({
        summary: result.summary || {},
        charts: {
          registrations: (result.charts?.registrations || []).map((row: { month: string; count: number | string }) => ({ month: row.month, count: Number(row.count || 0) })),
          downloads: (result.charts?.downloads || []).map((row: { month: string; downloads: number | string }) => ({ month: row.month, downloads: Number(row.downloads || 0) })),
          pwaInstalls: (result.charts?.pwaInstalls || []).map((row: { month: string; installs: number | string }) => ({ month: row.month, installs: Number(row.installs || 0) })),
          pwaPlatforms: (result.charts?.pwaPlatforms || []).map((row: { platform: string; count: number | string }) => ({ platform: row.platform, count: Number(row.count || 0) })),
          complaintsByCategory: (result.charts?.complaintsByCategory || []).map((row: { category: string; count: number | string }) => ({ category: row.category, count: Number(row.count || 0) })),
          complaintsByStatus: (result.charts?.complaintsByStatus || []).map((row: { status: string; count: number | string }) => ({ status: row.status, count: Number(row.count || 0) })),
          contentByStatus: (result.charts?.contentByStatus || []).map((row: { status: string; count: number | string }) => ({ status: row.status, count: Number(row.count || 0) })),
        },
      });
      setLastLoadedAt(result.summary?.generated_at ? new Date(result.summary.generated_at) : new Date());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load reports.");
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    const intervalId = window.setInterval(() => loadAnalytics(false), 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  const exportReport = () => {
    const monthLabel = analytics.summary.current_month_label || new Date().toLocaleString("en-IN", { month: "long", year: "numeric" });
    const generatedAt = lastLoadedAt || new Date();
    const lines = [
      ["Market Yard Portal - Monthly Admin Report"],
      ["Month", monthLabel],
      ["Period Start", analytics.summary.current_month_start || ""],
      ["Period End", analytics.summary.current_month_end || ""],
      ["Generated From Live DB", generatedAt.toLocaleString("en-IN")],
      [],
      ["Current Month Summary", "Count"],
      ["New member registrations", analytics.summary.monthly_registrations || 0],
      ["Member registrations approved", analytics.summary.monthly_approved_registrations || 0],
      ["Customer KYC submitted", analytics.summary.monthly_customer_kyc_submitted || 0],
      ["Customer KYC verified", analytics.summary.monthly_customer_kyc_verified || 0],
      ["Complaints received", analytics.summary.monthly_complaints_received || 0],
      ["Complaints resolved / closed", analytics.summary.monthly_complaints_resolved || 0],
      ["Posts created", analytics.summary.monthly_posts_created || 0],
      ["Posts published", analytics.summary.monthly_posts_published || 0],
      ["Notices / circulars published", analytics.summary.monthly_notices_published || 0],
      ["Market price entries published", analytics.summary.monthly_market_prices_published || 0],
      ["File downloads", analytics.summary.monthly_file_downloads || 0],
      ["Portal logins", analytics.summary.monthly_logins || 0],
      ["App installs", analytics.summary.monthly_pwa_installs || 0],
      ["Mobile change requests", analytics.summary.monthly_mobile_change_requests || 0],
      ["Mobile changes approved", analytics.summary.monthly_mobile_change_approved || 0],
      [],
      ["Overall Dashboard Snapshot", "Count"],
      ["Total members", analytics.summary.total_traders || 0],
      ["Approved members", analytics.summary.approved_traders || 0],
      ["Pending member reviews", analytics.summary.pending_traders || 0],
      ["Rejected members", analytics.summary.rejected_traders || 0],
      ["Suspended / deactivated members", analytics.summary.suspended_traders || 0],
      ["Active complaints", analytics.summary.active_complaints || 0],
      ["Resolved complaints total", analytics.summary.resolved_complaints || 0],
      ["Emergency active complaints", analytics.summary.emergency_complaints || 0],
      ["Published notices total", analytics.summary.published_notices || 0],
      ["Published content total", analytics.summary.published_content || 0],
      ["Total file downloads", analytics.summary.file_downloads || 0],
      ["Total app installs", analytics.summary.pwa_installs_total || 0],
      ["Mobile app installs", analytics.summary.pwa_installs_mobile || 0],
      ["Desktop app installs", analytics.summary.pwa_installs_desktop || 0],
      [],
      ["Monthly registrations"],
      ["Month", "Count"],
      ...analytics.charts.registrations.map((row) => [row.month, row.count]),
      [],
      ["File downloads by month"],
      ["Month", "Downloads"],
      ...analytics.charts.downloads.map((row) => [row.month, row.downloads]),
      [],
      ["App installs by month"],
      ["Month", "Installs"],
      ...analytics.charts.pwaInstalls.map((row) => [row.month, row.installs]),
      [],
      ["App installs by platform"],
      ["Platform", "Installs"],
      ...analytics.charts.pwaPlatforms.map((row) => [row.platform, row.count]),
      [],
      ["Complaints by category"],
      ["Category", "Count"],
      ...analytics.charts.complaintsByCategory.map((row) => [row.category, row.count]),
    ];
    const csv = lines.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `market-yard-monthly-admin-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Monthly admin report exported");
  };

  const summary = analytics.summary;
  const registrations = analytics.charts.registrations;
  const downloads = analytics.charts.downloads;
  const pwaInstalls = analytics.charts.pwaInstalls;
  const pwaPlatforms = analytics.charts.pwaPlatforms;
  const complaintsByCategory = analytics.charts.complaintsByCategory;
  const subtitle = lastLoadedAt
    ? `Live DB report for registrations, complaints, files, and portal engagement. Last updated ${lastLoadedAt.toLocaleString("en-IN")}.`
    : "Live DB report for registrations, complaints, files, and portal engagement.";

  return (
    <DashLayout kind="admin">
      <PageTitle
        title="Reports & Analytics"
        subtitle={subtitle}
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => loadAnalytics()}>
              Refresh
            </Button>
            <Button variant="outline" onClick={exportReport}>
              <Download className="mr-1 h-4 w-4" /> Export report
            </Button>
          </div>
        }
      />
      <Card className="mb-6 border-primary/20 bg-secondary/25">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <div className="font-display text-lg font-bold text-primary-dark">
              {summary.current_month_label || "Current month"} report
            </div>
            <div className="text-sm text-muted-foreground">
              Download includes live monthly registrations, KYC, complaints, posts, prices, downloads, logins, and installs.
            </div>
          </div>
          <Button onClick={exportReport}>
            <Download className="mr-1 h-4 w-4" /> Download monthly report
          </Button>
        </CardContent>
      </Card>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Store} label="This month registrations" value={loading ? "..." : (summary.monthly_registrations || 0).toLocaleString()} />
        <StatCard icon={IdCard} label="Customer KYC verified" value={loading ? "..." : (summary.monthly_customer_kyc_verified || 0).toLocaleString()} tone="success" />
        <StatCard icon={MessageSquare} label="Complaints this month" value={loading ? "..." : (summary.monthly_complaints_received || 0).toLocaleString()} tone="warning" />
        <StatCard icon={CheckCircle2} label="Complaints solved" value={loading ? "..." : (summary.monthly_complaints_resolved || 0).toLocaleString()} tone="success" />
        <StatCard icon={Newspaper} label="Posts published" value={loading ? "..." : (summary.monthly_posts_published || 0).toLocaleString()} tone="primary" />
        <StatCard icon={FileText} label="Notices published" value={loading ? "..." : (summary.monthly_notices_published || 0).toLocaleString()} />
        <StatCard icon={Download} label="Downloads this month" value={loading ? "..." : (summary.monthly_file_downloads || 0).toLocaleString()} tone="saffron" />
        <StatCard icon={Smartphone} label="Installs this month" value={loading ? "..." : (summary.monthly_pwa_installs || 0).toLocaleString()} tone="primary" />
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Logins last 30 days" value={loading ? "..." : (summary.portal_logins_30d || 0).toLocaleString()} />
        <StatCard icon={Download} label="File downloads" value={loading ? "..." : (summary.file_downloads || 0).toLocaleString()} tone="saffron" />
        <StatCard icon={Smartphone} label="Total App Installs" value={loading ? "..." : (summary.pwa_installs_total || 0).toLocaleString()} tone="primary" />
        <StatCard icon={Smartphone} label="Today's Installs" value={loading ? "..." : (summary.pwa_installs_today || 0).toLocaleString()} tone="success" />
        <StatCard icon={MessageSquare} label="Resolved complaints" value={loading ? "..." : (summary.resolved_complaints || 0).toLocaleString()} tone="success" />
        <StatCard icon={FileText} label="Published notices" value={loading ? "..." : (summary.published_notices || 0).toLocaleString()} />
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Store} label="Total Members" value={loading ? "..." : (summary.total_traders || 0).toLocaleString()} />
        <StatCard icon={CheckCircle2} label="Approved Members" value={loading ? "..." : (summary.approved_traders || 0).toLocaleString()} tone="success" />
        <StatCard icon={ClipboardList} label="Pending reviews" value={loading ? "..." : (summary.pending_traders || 0).toLocaleString()} tone="warning" />
        <StatCard icon={Newspaper} label="Published content" value={loading ? "..." : (summary.published_content || 0).toLocaleString()} tone="primary" />
        <StatCard icon={Smartphone} label="Mobile Installs" value={loading ? "..." : (summary.pwa_installs_mobile || 0).toLocaleString()} tone="saffron" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Monthly registrations" emptyLabel={registrations.length ? undefined : "No registration data yet."}>{registrations.length ? <BarChart data={registrations}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#86c127" radius={[6, 6, 0, 0]} /></BarChart> : null}</ChartCard>
        <ChartCard title="File downloads by month" emptyLabel={downloads.length ? undefined : "No file downloads yet."}>{downloads.length ? <LineChart data={downloads}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="downloads" stroke="#e37814" strokeWidth={3} /></LineChart> : null}</ChartCard>
        <ChartCard title="App installs by month" emptyLabel={pwaInstalls.length ? undefined : "No app installs yet."}>{pwaInstalls.length ? <BarChart data={pwaInstalls}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="installs" fill="#0284C7" radius={[6, 6, 0, 0]} /></BarChart> : null}</ChartCard>
        <ChartCard title="App installs by platform" emptyLabel={pwaPlatforms.length ? undefined : "No platform data yet."}>{pwaPlatforms.length ? <PieChart><Pie data={pwaPlatforms} dataKey="count" nameKey="platform" outerRadius={90} label>{pwaPlatforms.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart> : null}</ChartCard>
        <ChartCard title="Complaints by category" emptyLabel={complaintsByCategory.length ? undefined : "No complaints yet."}>{complaintsByCategory.length ? <PieChart><Pie data={complaintsByCategory} dataKey="count" nameKey="category" outerRadius={90} label>{complaintsByCategory.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart> : null}</ChartCard>
      </div>
    </DashLayout>
  );
}

function ChartCard({ title, children, emptyLabel }: { title: string; children: React.ReactElement | null; emptyLabel?: string }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-6">
        <h2 className="mb-4 font-display font-bold text-primary-dark">{title}</h2>
        <div className="h-72">
          {emptyLabel ? <div className="grid h-full place-items-center text-sm text-muted-foreground">{emptyLabel}</div> : <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminAuditPage() {
  const rows = ["Approved GO-012 registration", "Published market closure notice", "Assigned CMP-2408 to Security Department", "Rejected mobile request MCR-105", "Updated committee Member profile", "Downloaded monthly complaint report"];
  return (
    <DashLayout kind="admin">
      <PageTitle title="Audit Logs" subtitle="Transparent activity trail for admin decisions and portal changes." />
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="space-y-3">{rows.map((row, i) => <div key={row} className="flex items-center gap-3 rounded-lg border p-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary"><History className="h-4 w-4" /></div><div className="flex-1"><div className="font-medium text-primary-dark">{row}</div><div className="text-xs text-muted-foreground">Admin - 2026-07-{28 - i} - {10 + i}:30 AM</div></div><Badge variant="outline">Recorded</Badge></div>)}</div>
        </CardContent>
      </Card>
    </DashLayout>
  );
}

const me = OWNERS[0];
const myComplaints = COMPLAINTS.filter((c) => c.ownerId === me.id);

type TraderProfile = {
  full_name: string;
  full_name_en?: string | null;
  username: string;
  mobile: string;
  email: string | null;
  business_name: string;
  business_name_en?: string | null;
  business_category: string | null;
  gala_number: string | null;
  market_registration_number: string | null;
  verification_status: string;
  alternate_mobile: string | null;
  address_line1: string | null;
  address_line2: string | null;
  village_city: string | null;
  taluka: string | null;
  district: string | null;
  pincode: string | null;
  aadhaar_masked: string | null;
  pan_masked: string | null;
  blood_group: string | null;
  licence_number: string | null;
};

type TraderProfileDocument = {
  id: number;
  document_type: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  status: string;
  rejection_reason: string | null;
  verified_at: string | null;
  created_at: string;
};

type TraderGalaRecord = {
  id: number;
  business_name: string;
  business_name_en?: string | null;
  market_section: string | null;
  market_registration_number: string | null;
  licence_number: string | null;
  association_sequence_number: string | null;
  association_registration_number: string | null;
  status: string;
  is_primary: number | boolean;
  admin_remarks: string | null;
  verified_at: string | null;
  created_at: string;
  gala_number: string;
  business_category: string | null;
};

type RequiredTraderDocument = {
  documentType: string;
  label: string;
};

function useTraderProfile() {
  const [profile, setProfile] = useState<TraderProfile | null>(null);
  const [galas, setGalas] = useState<TraderGalaRecord[]>([]);
  const [documents, setDocuments] = useState<TraderProfileDocument[]>([]);
  const [requiredDocuments, setRequiredDocuments] = useState<RequiredTraderDocument[]>([]);
  const [missingRequiredDocuments, setMissingRequiredDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (active = true) => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/trader/profile", { credentials: "include" });
      const result = await response.json();
      if (active && result.ok) {
        setProfile(result.trader);
        setGalas(result.galas || []);
        setDocuments(result.documents || []);
        setRequiredDocuments(result.requiredDocuments || []);
        setMissingRequiredDocuments(result.missingRequiredDocuments || []);
      }
    } catch {
      if (active) toast.error("Unable to load Member profile.");
    } finally {
      if (active) setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    loadProfile(active);
    return () => {
      active = false;
    };
  }, []);

  return { profile, galas, documents, requiredDocuments, missingRequiredDocuments, loading, reload: () => loadProfile(true) };
}

function formatTraderAddress(profile: TraderProfile | null) {
  if (!profile) return "";
  return [profile.address_line1, profile.address_line2, profile.village_city, profile.taluka, profile.district, profile.pincode].filter(Boolean).join(", ");
}

function localizedDashboardName(lang: string, marathiValue?: string | null, englishValue?: string | null) {
  return lang === "en" ? englishValue || marathiValue || "" : marathiValue || englishValue || "";
}

function TraderGalaCards({ galas, onUpdated, emptyLabel = "No gala/shop records found." }: { galas: TraderGalaRecord[]; onUpdated?: () => Promise<void> | void; emptyLabel?: string }) {
  const [editingGala, setEditingGala] = useState<TraderGalaRecord | null>(null);
  const [savingGala, setSavingGala] = useState(false);
  const { lang } = useI18n();

  const saveGala = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingGala) return;
    const data = new FormData(event.currentTarget);
    setSavingGala(true);
    try {
      const response = await fetch(`/api/v1/trader/galas/${editingGala.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          galaNumber: String(data.get("galaNumber") || "").trim(),
          businessName: String(data.get("businessName") || "").trim(),
          marketSection: String(data.get("marketSection") || "").trim(),
          category: String(data.get("category") || "").trim(),
          marketRegistrationNumber: String(data.get("marketRegistrationNumber") || "").trim(),
          licenceNumber: String(data.get("licenceNumber") || "").trim(),
          associationSequenceNumber: String(data.get("associationSequenceNumber") || "").trim(),
          associationRegistrationNumber: String(data.get("associationRegistrationNumber") || "").trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not update gala/shop.");
      toast.success("Gala/shop update submitted for admin approval.");
      setEditingGala(null);
      await onUpdated?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update gala/shop.");
    } finally {
      setSavingGala(false);
    }
  };

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {galas.map((gala) => (
          <Card key={gala.id} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-display font-semibold text-primary-dark">Gala {gala.gala_number}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{localizedDashboardName(lang, gala.business_name, gala.business_name_en)}</div>
                </div>
                {gala.is_primary ? <Badge className="bg-primary text-white">Primary</Badge> : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline">{gala.business_category || gala.market_section || "General"}</Badge>
                <StatusBadge status={gala.status} />
              </div>
              <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                <div><span className="font-medium text-foreground">Market section:</span> {gala.market_section || "-"}</div>
                <div><span className="font-medium text-foreground">Registration:</span> {gala.market_registration_number || "-"}</div>
                <div><span className="font-medium text-foreground">Licence:</span> {gala.licence_number || "-"}</div>
                <div><span className="font-medium text-foreground">Anu. kramank:</span> {gala.association_sequence_number || "-"}</div>
                <div><span className="font-medium text-foreground">Kramank:</span> {gala.association_registration_number || "-"}</div>
              </div>
              {gala.admin_remarks && <div className="mt-3 rounded-md bg-destructive/10 p-2 text-xs text-destructive">{gala.admin_remarks}</div>}
              <Button type="button" size="sm" variant="outline" className="mt-4" onClick={() => setEditingGala(gala)}>
                <Pencil className="mr-1 h-4 w-4" /> Edit
              </Button>
            </CardContent>
          </Card>
        ))}
        {galas.length === 0 && <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">{emptyLabel}</div>}
      </div>
      <Dialog open={!!editingGala} onOpenChange={(open) => !open && setEditingGala(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Gala / Shop</DialogTitle>
            <DialogDescription>Changes are submitted to admin for approval before they become final.</DialogDescription>
          </DialogHeader>
          {editingGala && (
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={saveGala}>
              <div>
                <Label>Gala / Shop number *</Label>
                <Input name="galaNumber" required defaultValue={editingGala.gala_number} />
              </div>
              <div>
                <Label>Firm name *</Label>
                <Input name="businessName" required defaultValue={editingGala.business_name} />
              </div>
              <div>
                <Label>Market section *</Label>
                <Input name="marketSection" required defaultValue={editingGala.market_section || ""} />
              </div>
              <div>
                <Label>Business category</Label>
                <Input name="category" defaultValue={editingGala.business_category || editingGala.market_section || "Other"} />
              </div>
              <div>
                <Label>Registration number</Label>
                <Input name="marketRegistrationNumber" defaultValue={editingGala.market_registration_number || ""} />
              </div>
              <div>
                <Label>Licence number</Label>
                <Input name="licenceNumber" defaultValue={editingGala.licence_number || ""} />
              </div>
              <div>
                <Label>Anu. kramank</Label>
                <Input name="associationSequenceNumber" defaultValue={editingGala.association_sequence_number || ""} />
              </div>
              <div>
                <Label>Kramank</Label>
                <Input name="associationRegistrationNumber" defaultValue={editingGala.association_registration_number || ""} />
              </div>
              <div className="flex justify-end gap-2 sm:col-span-2">
                <Button type="button" variant="outline" onClick={() => setEditingGala(null)}>Cancel</Button>
                <Button className="bg-saffron text-saffron-foreground hover:bg-saffron/90" disabled={savingGala}>{savingGala ? "Submitting..." : "Submit for approval"}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function fileToUploadPayload(file: File): Promise<{ originalFilename: string; mimeType: string; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ originalFilename: file.name, mimeType: file.type, dataUrl: String(reader.result || "") });
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

async function readApiResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    const message = typeof body === "string"
      ? body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      : body?.message || body?.error;
    throw new Error(message || `Request failed with status ${response.status}.`);
  }

  return body;
}

const PROFILE_DOCUMENT_LABELS: Record<string, string> = {
  profile_photo: "Profile photo",
  aadhaar_masked: "Aadhaar card",
  pan: "PAN card",
  market_registration: "Licence document",
};
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function isAllowedTraderDocumentFile(file: File, documentType: string) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const imageOnly = documentType === "profile_photo";
  const allowedMimeTypes = imageOnly ? ["image/jpeg", "image/jpg", "image/png", "image/webp"] : ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
  const allowedExtensions = imageOnly ? ["jpg", "jpeg", "png", "webp"] : ["jpg", "jpeg", "png", "webp", "pdf"];
  return file.size > 0 && file.size <= 5 * 1024 * 1024 && allowedMimeTypes.includes(file.type) && allowedExtensions.includes(extension);
}

const getStoredKycRecords = (ownerId: string, seedRecords: CustomerKyc[]) => {
  try {
    const stored = localStorage.getItem(`customer_kyc_${ownerId}`);
    return stored ? JSON.parse(stored) as CustomerKyc[] : seedRecords;
  } catch {
    return seedRecords;
  }
};

export function OwnerProfilePage() {
  const { profile, galas, documents, requiredDocuments, missingRequiredDocuments, loading, reload } = useTraderProfile();
  const [saving, setSaving] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [bloodGroup, setBloodGroup] = useState("");
  const { lang } = useI18n();
  useEffect(() => {
    setBloodGroup(profile?.blood_group || "");
  }, [profile?.blood_group]);
  const displayFullName = localizedDashboardName(lang, profile?.full_name, profile?.full_name_en);
  const displayBusinessName = localizedDashboardName(lang, profile?.business_name, profile?.business_name_en);
  const initials = (displayFullName || "Member")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const activeDocuments = documents.filter((document) => document.status !== "replaced");
  const latestDocumentByType = activeDocuments.reduce<Record<string, TraderProfileDocument>>((acc, document) => {
    if (!acc[document.document_type]) acc[document.document_type] = document;
    return acc;
  }, {});
  const profilePhoto = latestDocumentByType.profile_photo;
  const missingProfileDetails = [
    !profile?.aadhaar_masked && "Aadhaar number",
    !profile?.pan_masked && "PAN number",
    !profile?.blood_group && "Blood group",
    !(profile?.licence_number || profile?.market_registration_number) && "Licence number",
  ].filter(Boolean) as string[];
  const requiredMissingLabels = [
    ...missingProfileDetails,
    ...missingRequiredDocuments.map((type) => PROFILE_DOCUMENT_LABELS[type] || type),
  ];

  const uploadDocument = async (documentType: string, file: File | null) => {
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (["heic", "heif"].includes(extension) || ["image/heic", "image/heif"].includes(file.type)) {
      toast.error("HEIC/HEIF photos are not supported yet. Please upload JPG, PNG, or WebP.");
      return;
    }
    if (!isAllowedTraderDocumentFile(file, documentType)) {
      toast.error(documentType === "profile_photo" ? "Profile photo must be JPG, PNG, or WebP under 5 MB." : "Document must be JPG, PNG, WebP, or PDF under 5 MB.");
      return;
    }
    setUploadingType(documentType);
    try {
      const formData = new FormData();
      formData.append("documentType", documentType);
      formData.append("file", file, file.name);
      const response = await fetch("/api/v1/trader/documents", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const result = await readApiResponse(response);
      if (!result?.ok) throw new Error(result?.message || result?.error || "Could not upload document.");
      toast.success(`${PROFILE_DOCUMENT_LABELS[documentType] || "Document"} uploaded for verification.`);
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload document.");
    } finally {
      setUploadingType(null);
    }
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const aadhaar = String(data.get("aadhaar") || "").replace(/\D/g, "");
    const pan = String(data.get("pan") || "").trim().toUpperCase();
    const licenceNumber = String(data.get("licenceNumber") || "").trim();
    if (!profile?.aadhaar_masked && !isValidAadhaar(aadhaar)) {
      toast.error("Please enter a valid Aadhaar number.");
      return;
    }
    if (!profile?.pan_masked && !/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)) {
      toast.error("Enter a valid PAN number.");
      return;
    }
    if (!bloodGroup) {
      toast.error("Blood group is required.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/v1/trader/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadhaar,
          pan,
          bloodGroup,
          licenceNumber,
          alternateMobile: String(data.get("alternateMobile") || "").trim() || null,
          addressLine1: String(data.get("addressLine1") || "").trim() || null,
          addressLine2: String(data.get("addressLine2") || "").trim() || null,
          villageCity: String(data.get("villageCity") || "").trim() || null,
          taluka: String(data.get("taluka") || "").trim() || null,
          district: String(data.get("district") || "").trim() || null,
          pincode: String(data.get("pincode") || "").trim() || null,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not save profile.");
      toast.success("Profile details saved.");
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashLayout kind="owner">
      <PageTitle title="My Profile" subtitle="Complete mandatory identity, health, licence, and profile photo details." />
      {requiredMissingLabels.length > 0 && (
        <Card className="mb-6 border-saffron/50 bg-saffron/10">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <h2 className="font-display font-semibold text-primary-dark">Mandatory dashboard documents pending</h2>
              <p className="mt-1 text-sm text-muted-foreground">{requiredMissingLabels.join(", ")} must be completed for your member dashboard record.</p>
            </div>
            <Badge className="bg-saffron text-primary-dark">{requiredMissingLabels.length} pending</Badge>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardContent className="p-6 text-center">
              {profilePhoto ? (
                <img src={`/api/v1/trader/documents/${profilePhoto.id}/download`} alt="Profile" className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-secondary" />
              ) : (
                <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-secondary font-display text-3xl font-bold text-primary">{initials}</div>
              )}
              <h2 className="mt-4 font-display text-xl font-bold text-primary-dark">{displayFullName || (loading ? "Loading..." : "Member")}</h2>
              <p className="text-sm text-muted-foreground">{displayBusinessName || "-"}</p>
              <div className="mt-3"><StatusBadge status={profile?.verification_status || "loading"} /></div>
              <div className="mt-5 grid gap-2">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90">
                  <Camera className="mr-2 h-4 w-4" /> Open camera
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(event) => {
                      uploadDocument("profile_photo", event.target.files?.[0] || null);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition hover:bg-secondary">
                  <Upload className="mr-2 h-4 w-4" /> Upload photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      uploadDocument("profile_photo", event.target.files?.[0] || null);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                {uploadingType === "profile_photo" && <div className="text-xs text-muted-foreground">Uploading photo...</div>}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h2 className="font-display font-semibold text-primary-dark">Required documents</h2>
              <div className="mt-4 space-y-3">
                {requiredDocuments.map((document) => {
                  const uploaded = latestDocumentByType[document.documentType];
                  return (
                    <div key={document.documentType} className="rounded-lg border p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-medium text-primary-dark">{document.label}</div>
                          <div className="max-w-full truncate text-xs text-muted-foreground">{uploaded?.original_filename || "Not uploaded"}</div>
                        </div>
                        <StatusBadge status={uploaded?.status || "pending"} />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uploaded && <Button size="sm" variant="outline" type="button" onClick={() => window.open(`/api/v1/trader/documents/${uploaded.id}/download`, "_blank")}><Eye className="mr-1 h-4 w-4" /> View</Button>}
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition hover:bg-secondary">
                          <Upload className="mr-1 h-4 w-4" /> {uploaded ? "Replace" : "Upload"}
                          <input
                            type="file"
                            accept={document.documentType === "profile_photo" ? "image/jpeg,image/png,image/webp" : "image/jpeg,image/png,image/webp,application/pdf"}
                            className="hidden"
                            onChange={(event) => uploadDocument(document.documentType, event.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                      {uploadingType === document.documentType && <div className="mt-2 text-xs text-muted-foreground">Uploading...</div>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="border-border/60">
          <CardContent className="p-6">
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={saveProfile}>
              <Field label="Full name" value={displayFullName} readOnly />
              <Field label="Username" value={profile?.username || ""} readOnly />
              <Field label="Email" value={profile?.email || ""} readOnly />
              <Field label="Registered mobile" value={profile?.mobile || ""} readOnly />
              <Field label="Firm name" value={displayBusinessName} readOnly />
              <Field label="Gala number" value={profile?.gala_number || ""} readOnly />
              <div>
                <Label>Aadhaar number *</Label>
                <Input name="aadhaar" required={!profile?.aadhaar_masked} inputMode="numeric" maxLength={12} pattern="\d{12}" placeholder={profile?.aadhaar_masked || "12 digit Aadhaar"} onInput={(event) => { event.currentTarget.value = limitDigits(event.currentTarget.value, 12); }} />
                {profile?.aadhaar_masked && <p className="mt-1 text-xs text-muted-foreground">Saved as {profile.aadhaar_masked}. Enter only to replace.</p>}
              </div>
              <div>
                <Label>PAN number *</Label>
                <Input name="pan" required={!profile?.pan_masked} maxLength={10} pattern="[A-Za-z]{5}\d{4}[A-Za-z]" placeholder={profile?.pan_masked || "ABCDE1234F"} className="uppercase" onInput={(event) => { event.currentTarget.value = limitPan(event.currentTarget.value); }} />
                {profile?.pan_masked && <p className="mt-1 text-xs text-muted-foreground">Saved as {profile.pan_masked}. Enter only to replace.</p>}
              </div>
              <div>
                <Label>Blood group *</Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
                  <SelectContent>{BLOOD_GROUPS.map((group) => <SelectItem key={group} value={group}>{group}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Licence number</Label>
                <Input name="licenceNumber" defaultValue={profile?.licence_number || profile?.market_registration_number || ""} />
              </div>
              <div>
                <Label>Alternate mobile</Label>
                <Input name="alternateMobile" defaultValue={profile?.alternate_mobile || ""} type="tel" inputMode="numeric" maxLength={10} pattern="\d{10}" placeholder="10 digit mobile" onInput={(event) => { event.currentTarget.value = limitDigits(event.currentTarget.value, 10); }} />
              </div>
              <Field label="Address line 1" name="addressLine1" value={profile?.address_line1 || ""} />
              <Field label="Address line 2" name="addressLine2" value={profile?.address_line2 || ""} />
              <Field label="Village / City" name="villageCity" value={profile?.village_city || ""} />
              <Field label="Taluka" name="taluka" value={profile?.taluka || ""} />
              <Field label="District" name="district" value={profile?.district || ""} />
              <div>
                <Label>Pincode</Label>
                <Input name="pincode" defaultValue={profile?.pincode || ""} inputMode="numeric" maxLength={6} pattern="\d{6}" placeholder="6 digit pincode" onInput={(event) => { event.currentTarget.value = limitDigits(event.currentTarget.value, 6); }} />
              </div>
              <div className="sm:col-span-2 rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">Current address: {formatTraderAddress(profile) || "-"}</div>
              <div className="sm:col-span-2 flex justify-end">
                <Button className="bg-saffron text-saffron-foreground hover:bg-saffron/90" disabled={saving}>{saving ? "Saving..." : "Save mandatory details"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6 border-border/60">
        <CardContent className="p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display font-semibold text-primary-dark">All Galas / Shops</h2>
              <p className="mt-1 text-sm text-muted-foreground">All shops linked to this member login and mobile number.</p>
            </div>
            <Button asChild size="sm" variant="outline"><Link to="/register">Add Another Gala / Shop</Link></Button>
          </div>
          <TraderGalaCards galas={galas} onUpdated={reload} />
        </CardContent>
      </Card>
    </DashLayout>
  );
}

function Field({ label, value, wide, name, readOnly = false }: { label: string; value: string; wide?: boolean; name?: string; readOnly?: boolean }) {
  return <div className={wide ? "sm:col-span-2" : ""}><Label>{label}</Label><Input name={name} defaultValue={value} readOnly={readOnly} className={readOnly ? "bg-secondary/50" : ""} /></div>;
}

export function OwnerKycPage() {
  type TraderKycRecord = {
    id: number;
    customer_code: string;
    full_name: string;
    full_name_en?: string | null;
    full_name_mr?: string | null;
    mobile: string;
    aadhaar_masked: string | null;
    pan_masked: string | null;
    photo_document_id: number | null;
    photo_url: string | null;
    kyc_status: string;
    risk_status?: string;
    active_market_warning_count?: number;
    verified_market_outstanding?: number;
    latest_warning_id?: number | null;
    latest_warning_note?: string | null;
    latest_warning_trader?: string | null;
    can_clear_latest_warning?: 0 | 1 | boolean;
    market_action_type?: string | null;
    market_action_reason?: string | null;
    market_action_by?: string | null;
    market_action_at?: string | null;
    created_at: string;
  };
  type RiskSearchResult = {
    id: number;
    customer_code: string;
    full_name: string;
    full_name_en?: string | null;
    full_name_mr?: string | null;
    mobile: string;
    kyc_status: string;
    risk_status: string;
    address_line1: string | null;
    village_city: string | null;
    district: string | null;
    active_market_warning_count: number;
    verified_market_outstanding: number;
    oldest_active_due_date: string | null;
    latest_warning_id: number | null;
    latest_warning_note: string | null;
    latest_warning_trader: string | null;
    can_clear_latest_warning: 0 | 1 | boolean;
    market_action_type?: string | null;
    market_action_reason?: string | null;
    market_action_by?: string | null;
    market_action_at?: string | null;
    linked_to_me: 0 | 1 | boolean;
  };
  type TraderDashboardProfile = {
    profile?: {
      gala_number: string | null;
    };
  };
  const [records, setRecords] = useState<TraderKycRecord[]>([]);
  const [profile, setProfile] = useState<TraderDashboardProfile["profile"]>(undefined);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [riskQuery, setRiskQuery] = useState("");
  const [riskResults, setRiskResults] = useState<RiskSearchResult[]>([]);
  const [riskLoading, setRiskLoading] = useState(false);
  const [warningCustomer, setWarningCustomer] = useState<RiskSearchResult | null>(null);
  const [warningSaving, setWarningSaving] = useState(false);
  const [clearingWarningId, setClearingWarningId] = useState<number | null>(null);
  const [recordFilter, setRecordFilter] = useState<"all" | "verified" | "risk">("all");
    const [customerPhoto, setCustomerPhoto] = useState<{ dataUrl: string; mimeType: string; originalFilename: string } | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<TraderKycRecord | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editCustomerPhoto, setEditCustomerPhoto] = useState<{ dataUrl: string; mimeType: string; originalFilename: string } | null>(null);
  const [editCameraOpen, setEditCameraOpen] = useState(false);
  const [editCameraStream, setEditCameraStream] = useState<MediaStream | null>(null);
  const { lang } = useI18n();
  const isMr = lang === "mr";
  const [addPanValue, setAddPanValue] = useState("");
  const editVideoRef = useRef<HTMLVideoElement | null>(null);
  const editCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const riskStatuses = ["warning_2", "high_risk", "blocked", "disputed"];
  const hasRiskWarning = (record: TraderKycRecord) =>
    Number(record.active_market_warning_count || 0) > 0 || riskStatuses.includes(record.risk_status || "");
  const getVisibleCustomerStatus = (record: Pick<TraderKycRecord, "kyc_status" | "risk_status" | "active_market_warning_count" | "market_action_type">) => {
    if (record.market_action_type) return String(record.market_action_type).replace(/_/g, " ");
    if (Number(record.active_market_warning_count || 0) > 0 || riskStatuses.includes(record.risk_status || "")) return "high risk";
    return record.kyc_status || "pending";
  };
  const isMarketRestricted = (record: { market_action_type?: string | null }) => Boolean(record.market_action_type);
  const displayCustomerName = (record: Pick<TraderKycRecord, "full_name" | "full_name_en" | "full_name_mr">) =>
    isMr ? record.full_name_mr || record.full_name : record.full_name_en || record.full_name;
  const getCustomerStatusLabel = (status: string) => {
    const normalized = status.replace(/_/g, " ");
    if (!isMr) return normalized;
    const labels: Record<string, string> = {
      approved: "\u092e\u0902\u091c\u0942\u0930",
      active: "\u0938\u0915\u094d\u0930\u093f\u092f",
      verified: "\u092a\u0921\u0924\u093e\u0933\u0932\u0947\u0932\u0947",
      pending: "\u092a\u094d\u0930\u0932\u0902\u092c\u093f\u0924",
      submitted: "\u0938\u093e\u0926\u0930",
      rejected: "\u0928\u093e\u0915\u093e\u0930\u0932\u0947\u0932\u0947",
      "high risk": "\u091c\u094b\u0916\u0940\u092e",
      blocked: "\u092c\u094d\u0932\u0949\u0915",
      suspended: "\u0928\u093f\u0932\u0902\u092c\u093f\u0924",
      removed: "\u0915\u093e\u0922\u0932\u0947\u0932\u0947",
      restored: "\u092a\u0942\u0930\u094d\u0935\u0935\u0924",
    };
    return labels[status] || normalized;
  };
  const showRecordAction = (record: TraderKycRecord) => {
    if (hasRiskWarning(record)) {
      toast.error(
        `${record.full_name} has ${Number(record.active_market_warning_count || 0)} risk alert(s). Outstanding: Rs. ${Number(record.verified_market_outstanding || 0).toLocaleString("en-IN")}. ${record.latest_warning_note || ""}`.trim(),
      );
      return;
    }
    toast.info(`${record.full_name} KYC is stored in database`);
  };
  const verifiedRecords = records.filter((record) => record.kyc_status === "verified");
  const riskRecords = records.filter((record) => hasRiskWarning(record));
  const visibleRecords = records.filter((record) => {
    if (recordFilter === "verified") return record.kyc_status === "verified";
    if (recordFilter === "risk") return hasRiskWarning(record);
    return true;
  });

  const loadTraderKyc = async () => {
    setLoading(true);
    try {
      const customersResponse = await fetch("/api/v1/trader/customers", { credentials: "include" });
      const customersPayload = await customersResponse.json();
      if (!customersResponse.ok || !customersPayload.ok) throw new Error(customersPayload.error || "Unable to load customer KYC.");
      setRecords(customersPayload.customers || []);

      const dashboardResponse = await fetch("/api/v1/trader/dashboard", { credentials: "include" });
      if (dashboardResponse.ok) {
        const dashboardPayload = await dashboardResponse.json();
        if (dashboardPayload.ok) setProfile(dashboardPayload.profile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load customer KYC.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTraderKyc();
  }, []);

  useEffect(() => {
    const query = riskQuery.trim();
    if (query.length < 2) {
      setRiskResults([]);
      return;
    }
    const timer = window.setTimeout(() => {
      void searchSharedCustomers(query);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [riskQuery]);
  useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((track) => track.stop());
    };
  }, [cameraStream]);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const stopCustomerCamera = () => {
    cameraStream?.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
    setCameraOpen(false);
  };

  const startCustomerCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Camera is not supported on this device or browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      setCameraStream(stream);
      setCameraOpen(true);
    } catch {
      toast.error("Camera permission denied. Please allow camera access and try again.");
    }
  };

  const captureCustomerPhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
      toast.error("Camera is still starting. Please try again.");
      return;
    }
    const maxWidth = 960;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
    setCustomerPhoto({ dataUrl, mimeType: "image/jpeg", originalFilename: `customer-photo-${Date.now()}.jpg` });
    stopCustomerCamera();
  };

  const addKycRecord = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const customerName = String(data.get("customerName") || "").trim();
    const phone = String(data.get("phone") || "").replace(/\D/g, "");
    const aadhaar = String(data.get("aadhaar") || "").replace(/\D/g, "");
    const pan = String(data.get("pan") || "").trim().toUpperCase();
    const addressLine1 = String(data.get("addressLine1") || "").trim();
    const villageCity = String(data.get("villageCity") || "").trim();
    const district = String(data.get("district") || "").trim();

    if (!customerName || !/^\d{10}$/.test(phone) || !/^[A-Z]{5}\d{4}[A-Z]$/.test(pan) || !addressLine1 || !villageCity || !district || !customerPhoto) {
      toast.error("Enter valid customer name, phone, PAN, address details, and live customer photo");
      return;
    }
    if (!isValidAadhaar(aadhaar)) {
      toast.error("Please enter a valid Aadhaar number.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/v1/trader/customers", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: customerName, mobile: phone, aadhaar, pan, addressLine1, villageCity, district, customerPhoto }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to save customer KYC.");
      toast.success(result.reused ? `${result.customerName || customerName} existing KYC linked to your dashboard.` : `${customerName} KYC submitted`);
      form.reset();
      setCustomerPhoto(null);
      stopCustomerCamera();
      await loadTraderKyc();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save customer KYC.");
    } finally {
      setSaving(false);
    }
  };

      const updateKycRecord = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCustomer) return;
    const data = new FormData(event.currentTarget);
    const customerName = String(data.get("customerName") || "").trim();
    const phone = String(data.get("phone") || "").replace(/\D/g, "");
    const aadhaar = String(data.get("aadhaar") || "").replace(/\D/g, "");
    const pan = normalizePan(String(data.get("pan") || ""));
    const addressLine1 = String(data.get("addressLine1") || "").trim();
    const villageCity = String(data.get("villageCity") || "").trim();
    const district = String(data.get("district") || "").trim();
    const dateOfBirth = String(data.get("dateOfBirth") || "").trim();
    const occupationBusiness = String(data.get("occupationBusiness") || "").trim();

    if (!customerName || !/^\d{10}$/.test(phone) || !addressLine1 || !villageCity || !district) {
      toast.error("Enter valid customer name, phone, and address details.");
      return;
    }
    if (aadhaar && !isValidAadhaar(aadhaar)) {
      toast.error("Please enter a valid Aadhaar number.");
      return;
    }
    if (pan && !isValidPan(pan)) {
      toast.error(getPanFormatErrorMessage(lang));
      return;
    }

    setEditSaving(true);
    try {
      const response = await fetch(`/api/v1/trader/customers/${editingCustomer.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: customerName,
          mobile: phone,
          aadhaar: aadhaar || null,
          pan: pan || null,
          addressLine1,
          villageCity,
          district,
          dateOfBirth: dateOfBirth || null,
          occupationBusiness: occupationBusiness || null,
          customerPhoto: editCustomerPhoto,
        }),
      });
      const result = await readApiResponse(response);
      if (!result?.ok) throw new Error(result?.message || result?.error || "Unable to update customer KYC.");
      toast.success(`${customerName} KYC updated`);
      closeEditCustomerDialog();
      await loadTraderKyc();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update customer KYC.";
      toast.error(message === "This PAN number is already registered with another customer." ? getPanDuplicateMessage(lang) : message);
    } finally {
      setEditSaving(false);
    }
  };

  const searchSharedCustomers = async (query: string) => {
    if (query.length < 2) {
      return;
    }
    setRiskLoading(true);
    try {
      const response = await fetch(`/api/v1/trader/customer-risk-search?q=${encodeURIComponent(query)}`, { credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not search customers.");
      setRiskResults(result.customers || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not search customers.");
    } finally {
      setRiskLoading(false);
    }
  };

  const linkExistingCustomer = async (customer: RiskSearchResult) => {
    try {
      const response = await fetch("/api/v1/trader/customers/link", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not link customer.");
      toast.success(`${customer.full_name} linked to your customer list.`);
      await loadTraderKyc();
      if (riskQuery.trim().length >= 2) await searchSharedCustomers(riskQuery.trim());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not link customer.");
    }
  };

  const submitMarketWarning = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!warningCustomer) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const amount = Number(data.get("amount") || 0);
    const dueDate = String(data.get("dueDate") || "");
    const firstWarningAt = String(data.get("firstWarningAt") || "");
    const secondWarningAt = String(data.get("secondWarningAt") || "");
    const note = String(data.get("note") || "").trim();
    if (!amount || amount <= 0 || !dueDate || !firstWarningAt || !secondWarningAt || note.length < 10) {
      toast.error("Amount, due date, both warning dates, and note are required.");
      return;
    }
    setWarningSaving(true);
    try {
      const response = await fetch("/api/v1/trader/customer-warnings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: warningCustomer.id, amount, dueDate, firstWarningAt, secondWarningAt, note }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not submit warning.");
      toast.success(`${warningCustomer.full_name} marked as high risk for all Members.`);
      setWarningCustomer(null);
      form.reset();
      await loadTraderKyc();
      if (riskQuery.trim().length >= 2) {
        const refresh = await fetch(`/api/v1/trader/customer-risk-search?q=${encodeURIComponent(riskQuery.trim())}`, { credentials: "include" });
        const payload = await refresh.json();
        if (payload.ok) setRiskResults(payload.customers || []);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit warning.");
    } finally {
      setWarningSaving(false);
    }
  };

  const clearMarketWarning = async (warningId: number | null | undefined, customerName: string) => {
    if (!warningId) return;
    const confirmed = window.confirm(`Mark ${customerName} payment as received and remove this risk alert for all Members?`);
    if (!confirmed) return;
    setClearingWarningId(warningId);
    try {
      const response = await fetch(`/api/v1/trader/customer-warnings/${warningId}/resolve`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks: "Payment received from customer. Risk warning cleared." }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not clear risk warning.");
      toast.success(`${customerName} payment marked received. All Members notified.`);
      await loadTraderKyc();
      if (riskQuery.trim().length >= 2) await searchSharedCustomers(riskQuery.trim());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not clear risk warning.");
    } finally {
      setClearingWarningId(null);
    }
  };

  const runCustomerMarketAction = async (record: { id: number; full_name: string }, actionType: "blocked" | "suspended" | "removed" | "restored") => {
    const reason = window.prompt(`${actionType.charAt(0).toUpperCase()}${actionType.slice(1)} ${record.full_name}. Reason visible to all Members?`)?.trim() || "";
    if (reason.length < 5) {
      toast.error("Reason is required.");
      return;
    }
    try {
      const response = await fetch(`/api/v1/trader/customers/${record.id}/market-action`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType, reason }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not update customer market status.");
      toast.success(`${record.full_name} ${actionType} update sent to all Members.`);
      await loadTraderKyc();
      if (riskQuery.trim().length >= 2) await searchSharedCustomers(riskQuery.trim());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update customer market status.");
    }
  };
  return (
    <DashLayout kind="owner">
      <PageTitle title="Customer KYC" subtitle="Search shared customer KYC first, link existing customers, and flag market-wide payment risks." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={IdCard} label="Total KYC" value={records.length} active={recordFilter === "all"} onClick={() => setRecordFilter("all")} />
        <StatCard icon={CheckCircle2} label="Verified" value={verifiedRecords.length} tone="success" active={recordFilter === "verified"} onClick={() => setRecordFilter("verified")} />
        <StatCard icon={AlertTriangle} label="Risk alerts" value={riskRecords.length} tone="danger" active={recordFilter === "risk"} onClick={() => setRecordFilter("risk")} />
      </div>

      <Card className="mb-6 border-border/60">
        <CardContent className="p-6">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <h2 className="font-display text-lg font-bold text-primary-dark">Global customer KYC search</h2>
              <p className="mt-1 text-sm text-muted-foreground">Search before adding KYC. If customer KYC already exists, link it to your dashboard instead of creating a duplicate.</p>
            </div>
            {profile?.gala_number && <Badge className="w-fit bg-secondary text-primary-dark">Gala {profile.gala_number}</Badge>}
          </div>
          <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); void searchSharedCustomers(riskQuery.trim()); }}>
            <Input value={riskQuery} onChange={(event) => setRiskQuery(event.target.value)} placeholder="Search by customer name, mobile, or customer code" />
            <Button type="submit" className="bg-saffron text-saffron-foreground hover:bg-saffron/90" disabled={riskLoading}><Search className="mr-1 h-4 w-4" /> {riskLoading ? "Searching..." : "Search"}</Button>
          </form>
          <div className="mt-4 grid gap-3">
            {riskResults.map((customer) => {
              const isHighRisk = Number(customer.active_market_warning_count || 0) > 0 || ["warning_2", "high_risk", "blocked", "disputed"].includes(customer.risk_status);
              return (
                <div key={customer.id} className={`rounded-lg border p-4 ${isHighRisk ? "border-destructive/40 bg-destructive/5" : "bg-background"}`}>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="whitespace-normal break-words font-display font-semibold text-primary-dark">{displayCustomerName(customer)}</div>
                        <StatusBadge status={getVisibleCustomerStatus(customer)} label={getCustomerStatusLabel(getVisibleCustomerStatus(customer))} />
                        {isHighRisk && <Badge className="bg-destructive text-white"><AlertTriangle className="mr-1 h-3.5 w-3.5" /> Red alert</Badge>}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">{customer.customer_code} - {customer.mobile} - {[customer.address_line1, customer.village_city, customer.district].filter(Boolean).join(", ")}</div>
                      {isMarketRestricted(customer) && <div className="mt-3 rounded-md border border-warning/30 bg-warning/5 p-3 text-sm"><div className="font-semibold text-primary-dark">Visible to all Members: {String(customer.market_action_type || "").replace("_", " ")}</div><div className="mt-1 text-muted-foreground">{customer.market_action_reason || "Reason not provided."}</div>{customer.market_action_by && <div className="mt-1 text-xs text-muted-foreground">Updated by {customer.market_action_by}{customer.market_action_at ? ` on ${new Date(customer.market_action_at).toLocaleDateString("en-IN")}` : ""}</div>}</div>}
                      {isHighRisk && (
                        <div className="mt-3 rounded-md border border-destructive/30 bg-background p-3 text-sm">
                          <div className="font-semibold text-destructive">Unpaid warning: Rs. {Number(customer.verified_market_outstanding || 0).toLocaleString("en-IN")} across {customer.active_market_warning_count} market alert(s)</div>
                          <div className="mt-1 text-muted-foreground">{customer.latest_warning_note || "No note available."}</div>
                          {customer.latest_warning_trader && <div className="mt-1 text-xs text-muted-foreground">Reported by {customer.latest_warning_trader}</div>}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Button size="sm" variant="outline" disabled={Boolean(customer.linked_to_me) || isMarketRestricted(customer)} onClick={() => linkExistingCustomer(customer)}>
                        {customer.linked_to_me ? "Already linked" : isMarketRestricted(customer) ? "Restricted" : "Link KYC"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setWarningCustomer(customer)}>
                        Give warning
                      </Button>
                      {isHighRisk && Boolean(customer.can_clear_latest_warning) && (
                        <Button
                          size="sm"
                          className="bg-success text-white hover:bg-success/90"
                          disabled={clearingWarningId === customer.latest_warning_id}
                          onClick={() => clearMarketWarning(customer.latest_warning_id, customer.full_name)}
                        >
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          {clearingWarningId === customer.latest_warning_id ? "Clearing..." : "Payment received"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {!riskLoading && riskQuery.trim().length >= 2 && riskResults.length === 0 && <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">No shared customer found. Add new KYC below.</div>}
          </div>
        </CardContent>
      </Card>

      {warningCustomer && (
        <Card className="mb-6 border-destructive/40 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-destructive">Member-to-Member payment warning for {warningCustomer.full_name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Use only after you have already given the first and second payment warnings to this customer.</p>
              </div>
              <Button variant="outline" onClick={() => setWarningCustomer(null)}>Cancel</Button>
            </div>
            <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={submitMarketWarning}>
              <div><Label>Unpaid amount *</Label><Input name="amount" required type="number" min="1" step="0.01" placeholder="Amount not paid" /></div>
              <div><Label>Original due date *</Label><Input name="dueDate" required type="date" /></div>
              <div><Label>First warning date *</Label><Input name="firstWarningAt" required type="datetime-local" /></div>
              <div><Label>Second warning date *</Label><Input name="secondWarningAt" required type="datetime-local" /></div>
              <div className="md:col-span-2"><Label>Warning note visible to all Members *</Label><Textarea name="note" required rows={4} placeholder="Example: Customer has not paid Rs. 25,000 for vegetable purchase from Gala A-105 even after two warnings." /></div>
              <div className="md:col-span-2"><Button variant="destructive" disabled={warningSaving}><AlertTriangle className="mr-1 h-4 w-4" /> {warningSaving ? "Saving warning..." : "Publish red warning for all Members"}</Button></div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(340px,420px)_minmax(760px,1fr)]">
        <Card className="min-w-0 border-border/60">
          <CardContent className="p-4 sm:p-6">
            <h2 className="font-display text-lg font-bold text-primary-dark">Add Customer KYC</h2>
            <form className="mt-5 grid gap-4" onSubmit={addKycRecord}>
              <div>
                <Label>Customer name *</Label>
                <Input name="customerName" required placeholder="Full customer name" />
              </div>
              <div>
                <Label>Phone number *</Label>
                <Input name="phone" required type="tel" inputMode="numeric" maxLength={10} pattern="\d{10}" placeholder="10-digit mobile number" onInput={(event) => { event.currentTarget.value = limitDigits(event.currentTarget.value, 10); }} />
              </div>
              <div>
                <Label>Aadhaar number *</Label>
                <Input name="aadhaar" required inputMode="numeric" maxLength={12} pattern="\d{12}" title="Please enter a valid Aadhaar number." placeholder="12 digit Aadhaar" onInput={(event) => { event.currentTarget.value = limitDigits(event.currentTarget.value, 12); }} />
              </div>
              <div>
                <Label>PAN number *</Label>
                <Input name="pan" required maxLength={10} pattern="[A-Za-z]{5}\d{4}[A-Za-z]" placeholder="ABCDE1234F" className="uppercase" onInput={(event) => { event.currentTarget.value = limitPan(event.currentTarget.value); }} />
              </div>
              <div>
                <Label>Customer live photo *</Label>
                <div className="mt-2 rounded-lg border bg-secondary/30 p-3">
                  {customerPhoto ? (
                    <div className="grid gap-3">
                      <img src={customerPhoto.dataUrl} alt="Captured customer" className="h-44 w-full rounded-md bg-background object-cover" />
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" onClick={startCustomerCamera}><Camera className="mr-1 h-4 w-4" /> Retake photo</Button>
                        <Button type="button" variant="ghost" onClick={() => setCustomerPhoto(null)}><Trash2 className="mr-1 h-4 w-4" /> Remove</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {cameraOpen ? (
                        <>
                          <video ref={videoRef} autoPlay playsInline muted className="h-44 w-full rounded-md bg-black object-cover" />
                          <div className="flex flex-wrap gap-2">
                            <Button type="button" onClick={captureCustomerPhoto} className="bg-saffron text-saffron-foreground hover:bg-saffron/90"><Camera className="mr-1 h-4 w-4" /> Capture photo</Button>
                            <Button type="button" variant="outline" onClick={stopCustomerCamera}>Cancel</Button>
                          </div>
                        </>
                      ) : (
                        <Button type="button" variant="outline" onClick={startCustomerCamera}><Camera className="mr-1 h-4 w-4" /> Open camera</Button>
                      )}
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label>Address *</Label>
                <Textarea name="addressLine1" required placeholder="Customer address" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>City / village *</Label>
                  <Input name="villageCity" required placeholder="City or village" />
                </div>
                <div>
                  <Label>District *</Label>
                  <Input name="district" required placeholder="District" defaultValue="Pune" />
                </div>
              </div>
              <Button className="bg-saffron text-saffron-foreground hover:bg-saffron/90" disabled={saving}><IdCard className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save KYC"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="min-w-0 border-border/60">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,320px)] md:items-center">
              <h2 className="font-display text-lg font-bold text-primary-dark">{isMr ? "\u092e\u093e\u091d\u094d\u092f\u093e \u0917\u094d\u0930\u093e\u0939\u0915\u093e\u0902\u091a\u094d\u092f\u093e \u092a\u0921\u0924\u093e\u0933\u0923\u0940 \u0928\u094b\u0902\u0926\u0940" : "My Customer KYC Records"}</h2>
              <div className="min-w-0"><SearchBar placeholder={isMr ? "\u0917\u094d\u0930\u093e\u0939\u0915 \u0936\u094b\u0927\u093e..." : "Search customer KYC..."} /></div>
            </div>
            <div className="grid gap-3 md:hidden">
              {visibleRecords.map((record) => (
                <div key={record.id} className={`rounded-lg border p-4 ${hasRiskWarning(record) ? "border-destructive/40 bg-destructive/5" : "bg-background"}`}>
                  <div className="flex items-start justify-between gap-3">
                    {record.photo_url ? <img src={record.photo_url} alt={displayCustomerName(record)} className="h-14 w-14 shrink-0 rounded-md object-cover" /> : <div className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-secondary text-primary"><Camera className="h-5 w-5" /></div>}
                    <div className="min-w-0 flex-1">
                      <div className="whitespace-normal break-words font-semibold text-primary-dark">{displayCustomerName(record)}</div>
                      <div className="mt-1 font-mono text-xs text-muted-foreground">{record.customer_code}</div>
                    </div>
                    <span className="shrink-0"><StatusBadge status={getVisibleCustomerStatus(record)} label={getCustomerStatusLabel(getVisibleCustomerStatus(record))} /></span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm">
                    <div className="flex justify-between gap-3"><span className="text-muted-foreground">{isMr ? "\u092e\u094b\u092c\u093e\u0908\u0932" : "Phone"}</span><span className="font-mono">{record.mobile}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-muted-foreground">{isMr ? "\u0906\u0927\u093e\u0930" : "Aadhaar"}</span><span className="font-mono">{record.aadhaar_masked || "-"}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-muted-foreground">{isMr ? "\u092a\u0945\u0928" : "PAN"}</span><span className="font-mono">{record.pan_masked || "-"}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-muted-foreground">{isMr ? "\u0926\u093f\u0928\u093e\u0902\u0915" : "Date"}</span><span>{new Date(record.created_at).toLocaleDateString(isMr ? "mr-IN" : "en-IN")}</span></div>
                  </div>
                  {isMarketRestricted(record) && (
                    <div className="mt-3 rounded-md border border-warning/30 bg-warning/5 p-3 text-sm">
                      <div className="font-semibold capitalize text-primary-dark">{String(record.market_action_type || "").replace("_", " ")}</div>
                      <div className="mt-1 text-muted-foreground">{record.market_action_reason || "Reason not provided."}</div>
                      {record.market_action_by && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Updated by {record.market_action_by}{record.market_action_at ? ` on ${new Date(record.market_action_at).toLocaleDateString("en-IN")}` : ""}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {isMarketRestricted(record) ? (
                      <Button size="sm" variant="outline" onClick={() => void runCustomerMarketAction(record, "restored")}>
                        {isMr ? "\u092a\u0942\u0930\u094d\u0935\u0935\u0924" : "Restore"}
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => void runCustomerMarketAction(record, "blocked")}>
                          {isMr ? "\u092c\u094d\u0932\u0949\u0915" : "Block"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => void runCustomerMarketAction(record, "suspended")}>
                          {isMr ? "\u0928\u093f\u0932\u0902\u092c\u093f\u0924" : "Suspend"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => void runCustomerMarketAction(record, "removed")}>
                          {isMr ? "\u0915\u093e\u0922\u093e" : "Remove"}
                        </Button>
                      </>
                    )}
                  </div>
                  {hasRiskWarning(record) && Boolean(record.can_clear_latest_warning) && (
                    <Button
                      size="sm"
                      className="mt-2 w-full whitespace-nowrap bg-success text-white hover:bg-success/90"
                      disabled={clearingWarningId === record.latest_warning_id}
                      onClick={() => clearMarketWarning(record.latest_warning_id, record.full_name)}
                    >
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      {clearingWarningId === record.latest_warning_id ? (isMr ? "\u0939\u091f\u0935\u0924 \u0906\u0939\u0947..." : "Clearing...") : (isMr ? "\u092a\u0947\u092e\u0947\u0902\u091f \u092e\u093f\u0933\u093e\u0932\u0947 / \u091c\u094b\u0916\u0940\u092e \u0939\u091f\u0935\u093e" : "Payment received / Clear risk")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <Table className="min-w-[900px] table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">{isMr ? "\u092b\u094b\u091f\u094b" : "Photo"}</TableHead>
                    <TableHead className="w-[190px]">{isMr ? "\u0917\u094d\u0930\u093e\u0939\u0915" : "Customer"}</TableHead>
                    <TableHead className="w-[120px]">{isMr ? "\u092e\u094b\u092c\u093e\u0908\u0932" : "Phone"}</TableHead>
                    <TableHead className="w-[140px]">{isMr ? "\u0906\u0927\u093e\u0930" : "Aadhaar"}</TableHead>
                    <TableHead className="w-[115px]">{isMr ? "\u092a\u0945\u0928" : "PAN"}</TableHead>
                    <TableHead className="w-[110px]">{isMr ? "\u0938\u094d\u0925\u093f\u0924\u0940" : "Status"}</TableHead>
                    <TableHead className="w-[110px]">{isMr ? "\u0926\u093f\u0928\u093e\u0902\u0915" : "Date"}</TableHead>
                    <TableHead className="w-[240px]">{isMr ? "\u0915\u0943\u0924\u0940" : "Action"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="align-top">{record.photo_url ? <img src={record.photo_url} alt={displayCustomerName(record)} className="h-12 w-12 rounded-md object-cover" /> : <div className="grid h-12 w-12 place-items-center rounded-md bg-secondary text-primary"><Camera className="h-4 w-4" /></div>}</TableCell>
                      <TableCell className="align-top"><div className="whitespace-normal font-medium leading-snug text-primary-dark">{displayCustomerName(record)}</div><div className="mt-1 font-mono text-xs text-muted-foreground">{record.customer_code}</div></TableCell>
                      <TableCell className="whitespace-nowrap align-top font-mono">{record.mobile}</TableCell>
                      <TableCell className="whitespace-nowrap align-top font-mono">{record.aadhaar_masked || "-"}</TableCell>
                      <TableCell className="whitespace-nowrap align-top font-mono">{record.pan_masked || "-"}</TableCell>
                      <TableCell className="align-top">
                        <span className="inline-flex whitespace-nowrap"><StatusBadge status={getVisibleCustomerStatus(record)} label={getCustomerStatusLabel(getVisibleCustomerStatus(record))} /></span>
                        {isMarketRestricted(record) && <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{record.market_action_reason || "Reason not provided."}</div>}
                      </TableCell>
                      <TableCell className="whitespace-nowrap align-top">{new Date(record.created_at).toLocaleDateString(isMr ? "mr-IN" : "en-IN")}</TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-wrap gap-2">
                          {isMarketRestricted(record) ? (
                            <Button size="sm" variant="outline" onClick={() => void runCustomerMarketAction(record, "restored")}>
                              {isMr ? "\u092a\u0942\u0930\u094d\u0935\u0935\u0924" : "Restore"}
                            </Button>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => void runCustomerMarketAction(record, "blocked")}>
                                {isMr ? "\u092c\u094d\u0932\u0949\u0915" : "Block"}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => void runCustomerMarketAction(record, "suspended")}>
                                {isMr ? "\u0928\u093f\u0932\u0902\u092c\u093f\u0924" : "Suspend"}
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => void runCustomerMarketAction(record, "removed")}>
                                {isMr ? "\u0915\u093e\u0922\u093e" : "Remove"}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {!loading && visibleRecords.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">{recordFilter === "all" ? (isMr ? "\u0905\u091c\u0942\u0928 \u0917\u094d\u0930\u093e\u0939\u0915 \u092a\u0921\u0924\u093e\u0933\u0923\u0940 \u0928\u094b\u0902\u0926\u0940 \u0928\u093e\u0939\u0940\u0924." : "No customer KYC records yet.") : `No ${recordFilter === "risk" ? "risk alert" : recordFilter} records found.`}</div>}
            {loading && <div className="py-8 text-center text-sm text-muted-foreground">{isMr ? "\u0917\u094d\u0930\u093e\u0939\u0915 \u092a\u0921\u0924\u093e\u0933\u0923\u0940 \u0928\u094b\u0902\u0926\u0940 \u0932\u094b\u0921 \u0939\u094b\u0924 \u0906\u0939\u0947\u0924..." : "Loading customer KYC records..."}</div>}
          </CardContent>
        </Card>
      </div>
    </DashLayout>
  );
}

type AdminKycTrader = {
  id: number;
  trader_code: string;
  full_name: string;
  business_name: string;
  mobile: string;
  gala_number: string | null;
};

type AdminKycRecord = {
  id: number;
  customer_code: string;
  full_name: string;
  mobile: string;
  kyc_status: string;
  created_at: string;
  trader_code: string | null;
  trader_name: string | null;
  business_name: string | null;
  gala_number: string | null;
  aadhaar_masked: string | null;
  pan_masked: string | null;
};

export function AdminTraderKycPage() {
  const { lang } = useI18n();

  type TraderKycRecord = {
    id: number;
    trader_code: string;
    full_name: string;
    full_name_en?: string | null;
    full_name_mr?: string | null;
    mobile: string;
    email: string | null;
    business_name: string;
    business_name_en?: string | null;
    gala_number: string | null;
    business_category: string | null;
    verification_status: string;
    user_status: string;
    created_at: string;
    verified_at: string | null;
    district: string | null;
    village_city: string | null;
    rejection_reason: string | null;
  };
  type TraderKycDocument = {
    id: number;
    document_type: string;
    original_filename: string;
    mime_type: string;
    file_size_bytes: number;
    status: string;
    rejection_reason: string | null;
    verified_at: string | null;
    created_at: string;
  };
  type TraderKycDetails = {
    application: TraderKycRecord;
    documents: TraderKycDocument[];
    history: Array<{
      id: number;
      old_status: string | null;
      new_status: string;
      remarks: string | null;
      changed_by_name: string;
      created_at: string;
    }>;
  };

  type TraderKycStatusCount = { verification_status: string; count: number | string };
  const [records, setRecords] = useState<TraderKycRecord[]>([]);
  const [kycStats, setKycStats] = useState<TraderKycStatusCount[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [details, setDetails] = useState<TraderKycDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadKycData = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch(`/api/v1/admin/trader-requests?status=all`, { credentials: "include" });
      const payload = await response.json();
      if (response.status === 401) {
        throw new Error("Admin login expired. Please sign in to Admin Hub again.");
      }
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to load Member KYC records.");
      setRecords(payload.requests || []);
      setKycStats(payload.stats || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load Member KYC records.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKycData();
  }, []);

  const openDetails = async (record: TraderKycRecord) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`/api/v1/admin/trader-requests/${record.trader_code}`, { credentials: "include" });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to load member KYC details.");
      setDetails({ application: payload.application, documents: payload.documents || [], history: payload.history || [] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load member KYC details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const decide = async (record: TraderKycRecord, decision: "approve" | "reject") => {
    const remarks = decision === "reject" ? window.prompt("Reason for rejecting this member KYC?")?.trim() : "";
    if (decision === "reject" && !remarks) {
      toast.error("Rejection reason is required.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`/api/v1/admin/trader-kyc/${record.id}/decision`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, remarks }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to update member KYC.");
      toast.success(`${record.full_name} ${decision === "approve" ? "approved" : "rejected"}`);
      await loadKycData();
      if (details?.application.id === record.id) await openDetails(record);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update member KYC.");
    } finally {
      setSaving(false);
    }
  };

  const filteredRecords = records.filter((record) => {
    const haystack = `${localizedKycName(lang, record.full_name, record.full_name_en)} ${localizedKycName(lang, record.business_name, record.business_name_en)} ${record.mobile} ${record.trader_code} ${record.gala_number || ""} ${record.business_category || ""}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  const kycStatusCount = (statuses: string[]) =>
    kycStats
      .filter((item) => statuses.includes(item.verification_status))
      .reduce((total, item) => total + Number(item.count || 0), 0);

  const counts = kycStats.length > 0 ? {
    total: kycStats.reduce((total, item) => total + Number(item.count || 0), 0),
    approved: kycStatusCount(["approved"]),
    pending: kycStatusCount(["submitted", "under_review", "correction_required"]),
    rejected: kycStatusCount(["rejected"]),
  } : {
    total: records.length,
    approved: records.filter((record) => record.verification_status === "approved").length,
    pending: records.filter((record) => ["submitted", "under_review", "correction_required"].includes(record.verification_status)).length,
    rejected: records.filter((record) => record.verification_status === "rejected").length,
  };

  return (
    <DashLayout kind="admin">
      <PageTitle title="Member KYC" subtitle="Review member verification records and documents. Customer KYC is managed in a separate module." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={IdCard} label="Total Members" value={counts.total} />
        <StatCard icon={CheckCircle2} label="Approved" value={counts.approved} tone="success" />
        <StatCard icon={Users} label="Pending Review" value={counts.pending} tone="saffron" />
        <StatCard icon={ThumbsDown} label="Rejected" value={counts.rejected} tone="danger" />
      </div>

      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative min-w-0 flex-1 sm:min-w-[260px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search member KYC..." />
            </div>
            <Button variant="outline" onClick={loadKycData} disabled={loading}>
              Refresh
            </Button>
          </div>
          {loadError && <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">{loadError}</div>}
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="font-medium text-primary-dark">{localizedKycName(lang, record.full_name, record.full_name_en)}</div>
                      <div className="text-xs text-muted-foreground">{record.trader_code}</div>
                    </TableCell>
                    <TableCell>
                      <div>{localizedKycName(lang, record.business_name, record.business_name_en)}</div>
                      <div className="text-xs text-muted-foreground">{[record.business_category, record.gala_number].filter(Boolean).join(" - ") || "-"}</div>
                    </TableCell>
                    <TableCell>{record.mobile}</TableCell>
                    <TableCell><StatusBadge status={record.verification_status} /></TableCell>
                    <TableCell>{new Date(record.created_at).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openDetails(record)}>
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Button>
                        {["submitted", "under_review", "correction_required"].includes(record.verification_status) && (
                          <>
                            <Button size="sm" className="bg-success text-white" disabled={saving} onClick={() => decide(record, "approve")}>
                              <ThumbsUp className="mr-1 h-4 w-4" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" disabled={saving} onClick={() => decide(record, "reject")}>
                              <ThumbsDown className="mr-1 h-4 w-4" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                      {loading ? "Loading member KYC records..." : "No member KYC records found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!details} onOpenChange={(open) => !open && setDetails(null)}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-primary-dark">{details ? localizedKycName(lang, details.application.full_name, details.application.full_name_en) : "Member KYC"}</DialogTitle>
            <DialogDescription>{details?.application.trader_code || "Member record"} - verification details and documents</DialogDescription>
          </DialogHeader>
          {detailsLoading && <div className="rounded-lg border p-4 text-sm text-muted-foreground">Loading member details...</div>}
          {details && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Business", localizedKycName(lang, details.application.business_name, details.application.business_name_en)],
                  ["Mobile", details.application.mobile],
                  ["Email", details.application.email || "-"],
                  ["Gala", details.application.gala_number || "-"],
                  ["Category", details.application.business_category || "-"],
                  ["Location", [details.application.village_city, details.application.district].filter(Boolean).join(", ") || "-"],
                  ["Applied", new Date(details.application.created_at).toLocaleString("en-IN")],
                  ["Status", details.application.verification_status],
                  ["Verified", details.application.verified_at ? new Date(details.application.verified_at).toLocaleString("en-IN") : "-"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border bg-secondary/30 p-3 text-sm">
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="mt-1 font-medium text-primary-dark">{value}</div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-display font-semibold text-primary-dark">Uploaded documents</h3>
                <div className="mt-3 overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>File</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {details.documents.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell className="capitalize">{document.document_type.replace(/_/g, " ")}</TableCell>
                          <TableCell>
                            <div className="font-medium">{document.original_filename}</div>
                            {document.rejection_reason && <div className="text-xs text-destructive">{document.rejection_reason}</div>}
                          </TableCell>
                          <TableCell>{Math.max(1, Math.round(document.file_size_bytes / 1024))} KB</TableCell>
                          <TableCell><StatusBadge status={document.status} /></TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => window.open(`/api/v1/admin/trader-documents/${document.id}/download?download=1`, "_blank")}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {details.documents.length === 0 && <TableRow><TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No documents uploaded with this member application.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold text-primary-dark">Review history</h3>
                <div className="mt-3 space-y-2">
                  {details.history.map((item) => (
                    <div key={item.id} className="rounded-lg border p-3 text-sm">
                      <div className="font-medium text-primary-dark">{item.old_status || "new"} {"->"} {item.new_status}</div>
                      <div className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString("en-IN")}</div>
                      {item.remarks && <div className="mt-1 text-muted-foreground">{item.remarks}</div>}
                    </div>
                  ))}
                  {details.history.length === 0 && <div className="rounded-lg border p-3 text-sm text-muted-foreground">No review history yet.</div>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashLayout>
  );
}

export function OwnerGalaPage() {
  const { profile, galas, loading, reload } = useTraderProfile();
  const { lang } = useI18n();
  const primaryGala = galas.find((gala) => gala.is_primary) || galas[0];
  const approvedCount = galas.filter((gala) => gala.status === "approved").length;
  const pendingCount = galas.filter((gala) => ["submitted", "under_review", "correction_required"].includes(gala.status)).length;
  const primaryBusinessName = localizedDashboardName(lang, primaryGala?.business_name || profile?.business_name, primaryGala?.business_name_en || profile?.business_name_en);

  return (
    <DashLayout kind="owner">
      <PageTitle title="My Gala Details" subtitle="All verified and submitted gala/shop records linked to your member login." action={<Button asChild variant="outline"><Link to="/register"><Plus className="mr-1 h-4 w-4" /> Add Gala / Shop</Link></Button>} />
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard icon={Store} label="Total Galas / Shops" value={loading ? "..." : galas.length} />
        <StatCard icon={CheckCircle2} label="Approved Shops" value={loading ? "..." : approvedCount} tone="success" />
        <StatCard icon={ClipboardList} label="Pending Review" value={loading ? "..." : pendingCount} tone="saffron" />
      </div>
      <Card className="mt-4 border-border/60 sm:mt-6">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
          <Field label="Primary business name" value={primaryBusinessName} readOnly />
          <Field label="Primary gala number" value={primaryGala?.gala_number || profile?.gala_number || ""} readOnly />
          <Field label="Business category" value={primaryGala?.business_category || profile?.business_category || ""} readOnly />
          <Field label="Market section" value={primaryGala?.market_section || (profile?.business_category ? `${profile.business_category} Section` : "")} readOnly />
          <Field label="Registered address" value={formatTraderAddress(profile)} wide readOnly />
        </CardContent>
      </Card>
      <Card className="mt-4 border-border/60 sm:mt-6">
        <CardContent className="p-4 sm:p-6">
          <h2 className="mb-4 font-display font-semibold text-primary-dark">All Linked Galas / Shops</h2>
          <TraderGalaCards galas={galas} onUpdated={reload} />
        </CardContent>
      </Card>
    </DashLayout>
  );
}

export function OwnerUpdatesPage() {
  const [items, setItems] = useState<DashboardPost[]>([]);
  useEffect(() => {
    fetch("/api/v1/trader/market-updates", { credentials: "include" }).then((response) => response.json()).then((result) => { if (result.ok) setItems(result.posts || []); }).catch(() => undefined);
  }, []);
  return <OwnerDbContentPage title="Market Updates" subtitle="Daily market prices, arrivals, weather alerts, and updates visible to your Member category." icon={Newspaper} items={items} attachmentBase="/api/v1/trader/content-attachments" />;
}

export function OwnerNoticesPage() {
  const [items, setItems] = useState<DashboardPost[]>([]);
  useEffect(() => {
    fetch("/api/v1/trader/notices", { credentials: "include" }).then((response) => response.json()).then((result) => { if (result.ok) setItems(result.notices || []); }).catch(() => undefined);
  }, []);
  return <OwnerDbContentPage title="Notices & Documents" subtitle="Official documents, circulars, meeting notices, and files visible to your Member category." icon={FileText} items={items} attachmentBase="/api/v1/trader/content-attachments" />;
}

function parseDashboardPostContent(value?: string | null) {
  try {
    const parsed = JSON.parse(value || "{}");
    return {
      category: String(parsed.category || "").trim(),
      details: String(parsed.details || "").trim(),
    };
  } catch {
    return { category: "", details: String(value || "").trim() };
  }
}

function OwnerDbContentPage({ title, subtitle, icon: Icon, items, attachmentBase = "/api/v1/public/content-attachments" }: { title: string; subtitle: string; icon: React.ElementType; items: DashboardPost[]; attachmentBase?: string }) {
  const { lang } = useI18n();
  const isMr = lang === "mr";
  const displayPost = (item: DashboardPost) => {
    const en = item.parsed || parseDashboardPostContent(item.content_en);
    const mr = item.parsed_mr || parseDashboardPostContent(item.content_mr);
    return isMr
      ? {
          title: item.title_mr || item.title_en,
          category: mr.category || en.category || "\u092c\u093e\u091c\u093e\u0930 \u092e\u093e\u0939\u093f\u0924\u0940",
          details: mr.details || en.details || "",
        }
      : {
          title: item.title_en,
          category: en.category || "General",
          details: en.details || "",
        };
  };
  return (
    <DashLayout kind="owner">
      <PageTitle title={title} subtitle={subtitle} />
      <Card className="border-border/60"><CardContent className="p-4 sm:p-6"><div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"><SearchBar /><Button variant="outline" className="w-full sm:w-auto">{isMr ? "\u092b\u093f\u0932\u094d\u091f\u0930" : "Filter"}</Button></div><div className="grid gap-3 md:grid-cols-2">{items.map((item) => {
        const image = (item.attachments || []).find((file) => file.attachment_type === "image");
        const display = displayPost(item);
        const visibleTo = item.share_audience === "category" ? item.share_category_name || (isMr ? "\u0924\u0941\u092e\u091a\u094d\u092f\u093e \u0935\u093f\u092d\u093e\u0917\u093e\u0932\u093e" : "your category") : isMr ? "\u0938\u0930\u094d\u0935 \u0938\u092d\u093e\u0938\u0926\u093e\u0902\u0928\u093e" : "All Members";
        return <div key={item.id} className="overflow-hidden rounded-lg border bg-background">{image && <img src={`${attachmentBase}/${image.id}/download`} className="h-40 w-full bg-secondary/30 object-contain sm:h-44" />}<div className="p-4"><div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">{display.category} - {new Date(item.published_at || item.created_at).toLocaleDateString(isMr ? "mr-IN" : "en-IN")}</div><h3 className="mt-1 whitespace-normal break-words font-display font-semibold leading-snug text-primary-dark">{display.title}</h3><p className="mt-1 whitespace-normal break-words text-sm leading-5 text-muted-foreground">{display.details}</p>{item.share_audience === "category" && <div className="mt-2 text-xs font-semibold text-primary">{isMr ? "\u0926\u093f\u0938\u0923\u093e\u0930" : "Visible to"} {visibleTo}</div>}</div></div><div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">{(item.attachments || []).map((file) => <Button key={file.id} size="sm" variant="outline" className="w-full justify-start sm:w-auto" onClick={() => window.open(`${attachmentBase}/${file.id}/download?download=1`, "_blank")}><Download className="mr-1 h-4 w-4 shrink-0" /> <span className="truncate">{file.original_filename}</span></Button>)}</div></div></div>;
      })}</div>{items.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">{isMr ? "\u0905\u091c\u0942\u0928 \u0915\u094b\u0923\u0924\u0940\u0939\u0940 \u092a\u094d\u0930\u0915\u093e\u0936\u093f\u0924 \u092e\u093e\u0939\u093f\u0924\u0940 \u0928\u093e\u0939\u0940." : "No published content yet."}</div>}</CardContent></Card>
    </DashLayout>
  );
}

function OwnerListPage({ title, subtitle, icon: Icon, items }: { title: string; subtitle: string; icon: React.ElementType; items: Array<{ id: string; title: string; meta: string; body: string; alert?: boolean; file?: string }> }) {
  return (
    <DashLayout kind="owner">
      <PageTitle title={title} subtitle={subtitle} />
      <Card className="border-border/60"><CardContent className="p-4 sm:p-6"><div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"><SearchBar /><Button variant="outline" className="w-full sm:w-auto">Filter</Button></div><div className="grid gap-3 md:grid-cols-2">{items.map((item) => <div key={item.id} className="rounded-lg border bg-background p-4"><div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">{item.meta}</div><h3 className="mt-1 whitespace-normal break-words font-display font-semibold leading-snug text-primary-dark">{item.title}</h3><p className="mt-1 whitespace-normal break-words text-sm leading-5 text-muted-foreground">{item.body}</p></div>{item.alert && <Badge className="shrink-0 bg-destructive text-white">Alert</Badge>}</div>{item.file && <Button className="mt-4 w-full justify-start sm:w-auto" size="sm" variant="outline"><Download className="mr-1 h-4 w-4 shrink-0" /> <span className="truncate">{item.file}</span></Button>}</div>)}</div></CardContent></Card>
    </DashLayout>
  );
}

type ComplaintFeedbackRequest = {
  id: number;
  complaint_id: number;
  ticket_number: string;
  subject: string;
  complaint_status: string;
  resolved_at?: string | null;
  resolved_by_name?: string | null;
  feedback_status: "requested" | "pending" | "approved" | "rejected";
  reopen_requested?: number | boolean;
  reopen_request_status?: string;
  admin_remark?: string | null;
  parsed?: { category?: string; description?: string; payment?: unknown };
};

const complaintFeedbackReactions = [
  { value: "amazing", icon: "\uD83E\uDD29", en: "Amazing", mr: "\u0909\u0924\u094d\u0915\u0943\u0937\u094d\u091f", tone: "border-success/50 bg-success/10" },
  { value: "satisfied", icon: "\uD83D\uDC4D", en: "Satisfied", mr: "\u0938\u092e\u093e\u0927\u093e\u0928\u0940", tone: "border-primary/50 bg-primary/10" },
  { value: "okay", icon: "\uD83D\uDE42", en: "Okay", mr: "\u0920\u0940\u0915 \u0906\u0939\u0947", tone: "border-saffron/50 bg-saffron/10" },
  { value: "not_satisfied", icon: "\uD83D\uDE15", en: "Not Satisfied", mr: "\u0905\u0938\u092e\u093e\u0927\u093e\u0928\u0940", tone: "border-warning/50 bg-warning/10" },
  { value: "very_dissatisfied", icon: "\uD83D\uDE1E", en: "Very Dissatisfied", mr: "\u0916\u0942\u092a \u0905\u0938\u092e\u093e\u0927\u093e\u0928\u0940", tone: "border-destructive/50 bg-destructive/10" },
];

const issueResolutionOptions = [
  { value: "still_unresolved", en: "Yes, issue is still unresolved", mr: "\u0939\u094b\u092f, \u0938\u092e\u0938\u094d\u092f\u093e \u0905\u091c\u0942\u0928\u0939\u0940 \u0938\u0941\u091f\u0932\u0947\u0932\u0940 \u0928\u093e\u0939\u0940" },
  { value: "partially_resolved", en: "Partially resolved", mr: "\u0905\u0902\u0936\u0924\u0903 \u0928\u093f\u0930\u093e\u0915\u0930\u0923 \u091d\u093e\u0932\u0947" },
  { value: "service_unsatisfactory", en: "Resolved, but service was unsatisfactory", mr: "\u0938\u092e\u0938\u094d\u092f\u093e \u0938\u0941\u091f\u0932\u0940, \u092a\u0923 \u0938\u0947\u0935\u093e \u0938\u092e\u093e\u0927\u093e\u0928\u0915\u093e\u0930\u0915 \u0928\u0935\u094d\u0939\u0924\u0940" },
];

function feedbackStatusLabel(status?: string | null, lang: string = "en") {
  const labels: Record<string, { en: string; mr: string }> = {
    requested: { en: "Feedback Pending", mr: "\u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u092a\u094d\u0930\u0932\u0902\u092c\u093f\u0924" },
    pending: { en: "Feedback Under Review", mr: "\u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u092a\u0930\u0940\u0915\u094d\u0937\u0923\u093e\u0927\u0940\u0928" },
    approved: { en: "Feedback Approved", mr: "\u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u092e\u0902\u091c\u0942\u0930" },
    rejected: { en: "Feedback Review Required", mr: "\u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u092a\u0941\u0928\u0930\u093e\u0935\u0932\u094b\u0915\u0928 \u0906\u0935\u0936\u094d\u092f\u0915" },
  };
  const item = labels[status || ""];
  return item ? item[lang === "mr" ? "mr" : "en"] : "";
}

function ComplaintFeedbackModal({ request, lang, onClose, onSubmitted }: { request: ComplaintFeedbackRequest | null; lang: string; onClose: () => void; onSubmitted: () => void }) {
  const [reaction, setReaction] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [issueStatus, setIssueStatus] = useState("still_unresolved");
  const [reopenRequested, setReopenRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isMr = lang === "mr";
  const dissatisfied = reaction === "not_satisfied" || reaction === "very_dissatisfied";

  useEffect(() => {
    if (!request) return;
    setReaction("");
    setRating(0);
    setComment("");
    setIssueStatus("still_unresolved");
    setReopenRequested(false);
  }, [request?.id]);

  const submit = async () => {
    if (!request) return;
    if (!reaction || rating < 1) {
      toast.error(isMr ? "\u0915\u0943\u092a\u092f\u093e \u092a\u094d\u0930\u0924\u093f\u0915\u094d\u0930\u093f\u092f\u093e \u0906\u0923\u093f \u0930\u0947\u091f\u093f\u0902\u0917 \u0928\u093f\u0935\u0921\u093e." : "Please select a reaction and star rating.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`/api/v1/trader/complaints/${request.complaint_id}/feedback`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction, rating, comment, issueResolutionStatus: dissatisfied ? issueStatus : "resolved", reopenRequested: dissatisfied && reopenRequested }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not submit feedback.");
      toast.success(isMr ? "\u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u0905\u200d\u0945\u0921\u092e\u093f\u0928\u0915\u0921\u0947 \u0924\u092a\u093e\u0938\u0923\u0940\u0938\u093e\u0920\u0940 \u092a\u093e\u0920\u0935\u0932\u093e." : "Feedback sent to admin for review.");
      onSubmitted();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={Boolean(request)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-3xl">
        {request && (
          <div>
            <div className="bg-primary px-5 py-5 text-white sm:px-6">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-white">{isMr ? "\u0906\u092a\u0932\u094d\u092f\u093e \u0924\u0915\u094d\u0930\u093e\u0930\u0940\u091a\u0947 \u0928\u093f\u0930\u093e\u0915\u0930\u0923 \u0915\u0938\u0947 \u091d\u093e\u0932\u0947?" : "How was your complaint resolution?"}</DialogTitle>
                <DialogDescription className="text-white/85">
                  {isMr ? "\u0906\u092a\u0932\u0940 \u0924\u0915\u094d\u0930\u093e\u0930 \u0928\u093f\u0930\u093e\u0915\u0930\u0923 \u091d\u093e\u0932\u094d\u092f\u093e\u091a\u0947 \u0928\u094b\u0902\u0926\u0935\u093f\u0923\u094d\u092f\u093e\u0924 \u0906\u0932\u0947 \u0906\u0939\u0947. \u0915\u0943\u092a\u092f\u093e \u092f\u093e \u0928\u093f\u0930\u093e\u0915\u0930\u0923\u093e\u092c\u0926\u094d\u0926\u0932 \u0906\u092a\u0932\u093e \u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u0926\u094d\u092f\u093e." : "Your complaint has been marked as resolved. Please share your feedback about the resolution."}
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-3 rounded-lg border bg-secondary/40 p-4 sm:grid-cols-2">
                <div><div className="text-xs text-muted-foreground">Complaint ID</div><div className="font-mono font-semibold text-primary-dark">{request.ticket_number}</div></div>
                <div><div className="text-xs text-muted-foreground">Category</div><div className="font-semibold text-primary-dark">{request.parsed?.category || "General"}</div></div>
                <div className="sm:col-span-2"><div className="text-xs text-muted-foreground">Complaint Title</div><div className="font-display font-semibold text-primary-dark">{request.subject}</div></div>
                <div><div className="text-xs text-muted-foreground">Resolved Date</div><div className="text-sm font-medium">{request.resolved_at ? new Date(request.resolved_at).toLocaleString("en-IN") : "-"}</div></div>
                <div><div className="text-xs text-muted-foreground">Resolved By</div><div className="text-sm font-medium">{request.resolved_by_name || "Admin team"}</div></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-5">
                {complaintFeedbackReactions.map((item) => {
                  const selected = reaction === item.value;
                  return (
                    <button key={item.value} type="button" onClick={() => setReaction(item.value)} className={`relative min-h-28 rounded-lg border p-3 text-center transition hover:-translate-y-0.5 hover:shadow-md ${selected ? `${item.tone} ring-2 ring-primary/25` : "bg-background hover:border-primary/50"}`}>
                      {selected && <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-primary" />}
                      <div className="text-3xl leading-none">{item.icon}</div>
                      <div className="mt-2 text-sm font-bold text-primary-dark">{isMr ? item.mr : item.en}</div>
                      <div className="mt-1 text-[11px] text-muted-foreground">{isMr ? item.en : item.mr}</div>
                    </button>
                  );
                })}
              </div>
              <div>
                <Label>{isMr ? "\u0938\u094d\u091f\u093e\u0930 \u0930\u0947\u091f\u093f\u0902\u0917" : "Star rating"}</Label>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className={`grid h-11 w-11 place-items-center rounded-lg border text-xl transition ${rating >= star ? "border-saffron bg-saffron text-primary-dark" : "bg-background text-muted-foreground hover:border-saffron"}`}>{"\u2605"}</button>
                  ))}
                </div>
              </div>
              {dissatisfied && (
                <div className="space-y-4 rounded-lg border border-destructive/25 bg-destructive/5 p-4">
                  <div>
                    <Label>{isMr ? "\u0906\u092a\u0932\u0940 \u0938\u092e\u0938\u094d\u092f\u093e \u0905\u091c\u0942\u0928\u0939\u0940 \u0938\u0941\u091f\u0932\u0947\u0932\u0940 \u0928\u093e\u0939\u0940 \u0915\u093e?" : "Is your issue still unresolved?"}</Label>
                    <div className="mt-2 grid gap-2">
                      {issueResolutionOptions.map((item) => (
                        <button key={item.value} type="button" onClick={() => setIssueStatus(item.value)} className={`rounded-lg border p-3 text-left text-sm transition hover:border-primary ${issueStatus === item.value ? "border-saffron bg-saffron/15 font-semibold text-primary-dark" : "bg-background"}`}>
                          {isMr ? item.mr : item.en}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-start gap-3 rounded-lg border bg-background p-3 text-sm">
                    <input type="checkbox" className="mt-1 h-4 w-4" checked={reopenRequested} onChange={(event) => setReopenRequested(event.target.checked)} />
                    <span>{isMr ? "\u0924\u0915\u094d\u0930\u093e\u0930 \u092a\u0941\u0928\u094d\u0939\u093e \u0938\u0941\u0930\u0942 \u0915\u0930\u0923\u094d\u092f\u093e\u091a\u0940 \u0935\u093f\u0928\u0902\u0924\u0940" : "Request Reopen Complaint"}</span>
                  </label>
                </div>
              )}
              <div>
                <Label>{isMr ? "\u0906\u092a\u0932\u093e \u0905\u0928\u0941\u092d\u0935 \u0905\u0927\u093f\u0915 \u0938\u0935\u093f\u0938\u094d\u0924\u0930 \u0938\u093e\u0902\u0917\u093e" : "Tell us more about your experience"}</Label>
                <Textarea value={comment} onChange={(event) => setComment(event.target.value.slice(0, 500))} rows={4} maxLength={500} placeholder={isMr ? "\u0906\u092a\u0932\u094d\u092f\u093e \u0924\u0915\u094d\u0930\u093e\u0930\u0940\u0935\u0930 \u091d\u093e\u0932\u0947\u0932\u094d\u092f\u093e \u0915\u093e\u0930\u094d\u092f\u0935\u093e\u0939\u0940\u092c\u0926\u094d\u0926\u0932 \u0905\u0924\u093f\u0930\u093f\u0915\u094d\u0924 \u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u0926\u094d\u092f\u093e." : "Please share any additional feedback about how your complaint was handled."} />
                <div className="mt-1 text-right text-xs text-muted-foreground">{comment.length}/500</div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>{isMr ? "\u0928\u0902\u0924\u0930 \u0906\u0920\u0935\u0923 \u0915\u0930\u0942\u0928 \u0926\u094d\u092f\u093e" : "Remind Me Later"}</Button>
                <Button type="button" className="bg-saffron text-saffron-foreground hover:bg-saffron/90" onClick={submit} disabled={submitting}>{submitting ? (isMr ? "\u0938\u092c\u092e\u093f\u091f \u0939\u094b\u0924 \u0906\u0939\u0947..." : "Submitting...") : (isMr ? "\u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u0938\u092c\u092e\u093f\u091f \u0915\u0930\u093e" : "Submit Feedback")}</Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function OwnerComplaintsPage() {
  type TraderComplaint = {
    id: number;
    ticket_number: string;
    subject: string;
    priority: string;
    status: string;
    created_at: string;
    feedback_id?: number | null;
    feedback_status?: string | null;
    reopen_requested?: number | boolean | null;
    reopen_request_status?: string | null;
    parsed?: { category?: string; description?: string };
    history: Array<{ id: number; old_status: string | null; new_status: string; remarks: string | null; changed_by_name: string; created_at: string }>;
  };
  const { lang } = useI18n();
  const [complaints, setComplaints] = useState<TraderComplaint[]>([]);
  const [feedbackRequests, setFeedbackRequests] = useState<ComplaintFeedbackRequest[]>([]);
  const [activeFeedback, setActiveFeedback] = useState<ComplaintFeedbackRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const isMr = lang === "mr";

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const [complaintsResponse, feedbackResponse] = await Promise.all([
        fetch("/api/v1/trader/complaints", { credentials: "include" }),
        fetch("/api/v1/trader/complaints/pending-feedback", { credentials: "include" }),
      ]);
      const complaintsResult = await complaintsResponse.json();
      const feedbackResult = await feedbackResponse.json();
      if (!complaintsResponse.ok || !complaintsResult.ok) throw new Error(complaintsResult.error || "Could not load complaints.");
      if (!feedbackResponse.ok || !feedbackResult.ok) throw new Error(feedbackResult.error || "Could not load pending feedback.");
      setComplaints(complaintsResult.complaints || []);
      const pending = feedbackResult.feedbackRequests || [];
      setFeedbackRequests(pending);
      setActiveFeedback((current) => current || pending[0] || null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadComplaints(); }, []);

  const feedbackByComplaint = feedbackRequests.reduce<Record<number, ComplaintFeedbackRequest>>((acc, item) => {
    acc[item.complaint_id] = item;
    return acc;
  }, {});

  return (
    <DashLayout kind="owner">
      <PageTitle title={isMr ? "\u092e\u093e\u091d\u094d\u092f\u093e \u0924\u0915\u094d\u0930\u093e\u0930\u0940" : "My Complaints"} subtitle={isMr ? "\u0924\u0915\u094d\u0930\u093e\u0930\u0940\u091a\u0940 \u0938\u094d\u0925\u093f\u0924\u0940, \u0905\u200d\u0945\u0921\u092e\u093f\u0928 \u091f\u093f\u092a\u094d\u092a\u0923\u0940 \u0906\u0923\u093f \u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u091f\u094d\u0930\u0945\u0915 \u0915\u0930\u093e." : "Track complaint status, admin comments, and resolution feedback."} action={<Button asChild><Link to="/owner/new-complaint"><Plus className="mr-1 h-4 w-4" /> New Complaint</Link></Button>} />
      {feedbackRequests.length > 0 && (
        <Card className="mb-5 border-saffron/50 bg-saffron/5">
          <CardContent className="p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-primary-dark">{isMr ? "\u092a\u094d\u0930\u0932\u0902\u092c\u093f\u0924 \u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f" : "Pending Feedback"}</h2>
                <p className="text-sm text-muted-foreground">{isMr ? "\u0928\u093f\u0930\u093e\u0915\u0930\u0923 \u091d\u093e\u0932\u0947\u0932\u094d\u092f\u093e \u0924\u0915\u094d\u0930\u093e\u0930\u0940\u0902\u0935\u0930 \u0906\u092a\u0932\u093e \u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u0926\u094d\u092f\u093e." : "Share your feedback for resolved complaints."}</p>
              </div>
              <Badge className="bg-saffron text-primary-dark">{feedbackRequests.length}</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {feedbackRequests.map((item) => (
                <div key={item.id} className="rounded-lg border bg-background p-4">
                  <div className="font-mono text-xs text-muted-foreground">{item.ticket_number}</div>
                  <h3 className="mt-1 font-display font-semibold text-primary-dark">{item.subject}</h3>
                  <div className="mt-2 text-sm text-muted-foreground">{item.parsed?.category || "General"} - {item.resolved_at ? new Date(item.resolved_at).toLocaleDateString("en-IN") : "Resolved"}</div>
                  <Button className="mt-4 bg-saffron text-saffron-foreground hover:bg-saffron/90" onClick={() => setActiveFeedback(item)}>{isMr ? "\u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u0926\u094d\u092f\u093e" : "Give Feedback"}</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4">
        {complaints.map((c) => {
          const pendingFeedback = feedbackByComplaint[c.id];
          const status = c.feedback_status || pendingFeedback?.feedback_status;
          return (
            <Card key={c.id} className="border-border/60">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs text-muted-foreground">{c.ticket_number} - {c.parsed?.category || "General"}</div>
                    <h2 className="whitespace-normal break-words font-display font-semibold leading-snug text-primary-dark">{c.subject}</h2>
                    <p className="mt-1 whitespace-normal break-words text-sm leading-5 text-muted-foreground">{c.parsed?.description || ""}</p>
                    {status && <div className="mt-2"><Badge className="bg-primary/10 text-primary">{feedbackStatusLabel(status, lang)}</Badge></div>}
                    {c.reopen_request_status === "pending" && <Badge className="mt-2 bg-warning text-white">Reopen Requested</Badge>}
                  </div>
                  <span className="shrink-0"><StatusBadge status={c.status} /></span>
                </div>
                {pendingFeedback && <Button size="sm" className="mt-4 bg-saffron text-saffron-foreground hover:bg-saffron/90" onClick={() => setActiveFeedback(pendingFeedback)}>{isMr ? "\u0905\u092d\u093f\u092a\u094d\u0930\u093e\u092f \u0926\u094d\u092f\u093e" : "Give Feedback"}</Button>}
                <div className="mt-4 grid gap-2">
                  {c.history.slice(0, 4).map((item) => (
                    <div key={item.id} className="rounded-lg border bg-secondary/20 p-3 text-sm">
                      <div className="font-medium text-primary-dark">{item.old_status || "submitted"} {"->"} {item.new_status}</div>
                      {item.remarks && <div className="mt-1 text-muted-foreground">{item.remarks}</div>}
                      <div className="mt-1 text-xs text-muted-foreground">{item.changed_by_name} - {new Date(item.created_at).toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!loading && complaints.length === 0 && <Card className="border-border/60"><CardContent className="py-10 text-center text-sm text-muted-foreground">No complaints yet.</CardContent></Card>}
        {loading && <Card className="border-border/60"><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading complaints...</CardContent></Card>}
      </div>
      <ComplaintFeedbackModal request={activeFeedback} lang={lang} onClose={() => setActiveFeedback(null)} onSubmitted={() => { setActiveFeedback(null); loadComplaints(); }} />
    </DashLayout>
  );
}

export function OwnerNewComplaintPage() {
  return (
    <DashLayout kind="owner">
      <PageTitle title="Raise Complaint" subtitle="Submit a facility issue with priority, details, and supporting media." />
      <ComplaintForm />
    </DashLayout>
  );
}

export function OwnerPostPage() {
  const { profile } = useTraderProfile();
  const { logout } = useAuth();
  const router = useRouter();
  const { lang } = useI18n();
  const [postCategory, setPostCategory] = useState("Market Rate Update");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [myPosts, setMyPosts] = useState<DashboardPost[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const section = profile?.business_category ? `${profile.business_category} Section` : "";
  const displayFullName = localizedDashboardName(lang, profile?.full_name, profile?.full_name_en);
  const displayBusinessName = localizedDashboardName(lang, profile?.business_name, profile?.business_name_en);
  const loadMyPosts = async () => {
    try {
      const response = await fetch("/api/v1/trader/posts", { credentials: "include" });
      const result = await response.json();
      if (result.ok) setMyPosts(result.posts || []);
    } catch {
      toast.error("Could not load submitted posts.");
    }
  };

  useEffect(() => {
    loadMyPosts();
  }, []);

  const submitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const titleEn = String(data.get("titleEn") || "").trim();
    const contentEn = String(data.get("contentEn") || "").trim();
    if (!titleEn || !contentEn) {
      toast.error("Post title and details are required.");
      return;
    }
    const oversizedImage = imageFiles.find((file) => file.size > 25 * 1024 * 1024);
    const oversizedVideo = videoFiles.find((file) => file.size > 25 * 1024 * 1024);
    if (oversizedImage || oversizedVideo) {
      toast.error("Each post image/video must be 25 MB or smaller.");
      return;
    }
    setSubmitting(true);
    try {
      const images = await Promise.all(imageFiles.slice(0, 4).map(fileToUploadPayload));
      const videos = await Promise.all(videoFiles.slice(0, 2).map(fileToUploadPayload));
      const response = await fetch("/api/v1/trader/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titleEn, contentEn, category: postCategory, attachments: { images, videos } }),
      });
      const result = await response.json();
      if (response.status === 401) {
        logout();
        router.navigate({ to: "/login" });
        throw new Error("Your session expired. Please sign in again.");
      }
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not submit post.");
      toast.success(`Post submitted with ${images.length} image(s) and ${videos.length} video(s).`);
      form.reset();
      setPostCategory("Market Rate Update");
      setImageFiles([]);
      setVideoFiles([]);
      await loadMyPosts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashLayout kind="owner">
      <PageTitle title="Create Post" subtitle="Share a market update, gala announcement, or request with image and video attachments." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <form
              className="grid gap-5"
              onSubmit={submitPost}
            >
              <div className="rounded-lg bg-secondary/60 p-4">
                <h2 className="font-display font-semibold text-primary-dark">Posting as</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Gala owner name</Label>
                    <Input value={displayFullName} disabled />
                  </div>
                  <div>
                    <Label>Gala number</Label>
                    <Input value={profile?.gala_number || ""} disabled />
                  </div>
                  <div>
                    <Label>Business name</Label>
                    <Input value={displayBusinessName} disabled />
                  </div>
                  <div>
                    <Label>Market section</Label>
                    <Input value={section} disabled />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Post type *</Label>
                  <Select value={postCategory} onValueChange={setPostCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MEMBER_POST_CATEGORIES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Visible to *</Label>
                  <Input value="Association Admin only" disabled />
                </div>
              </div>

              <div>
                <Label>Post title *</Label>
                <Input name="titleEn" required placeholder="Short title for your post" />
              </div>

              <div>
                <Label>Post details *</Label>
                <Textarea name="contentEn" required rows={6} placeholder="Write the update, announcement, request, or details clearly." />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm transition hover:border-primary ${imageFiles.length ? "border-success bg-success/10" : "border-border bg-secondary/40 hover:bg-secondary"}`}>
                  <Camera className="h-7 w-7 text-primary" />
                  <span className="font-medium text-primary-dark">Upload post images</span>
                  <span className={`max-w-full truncate text-xs ${imageFiles.length ? "font-medium text-success" : "text-muted-foreground"}`}>{imageFiles.length ? `${imageFiles.length} selected - ${imageFiles[0].name}` : "JPG, PNG, WEBP. Multiple allowed."}</span>
                  <span className="mt-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white">Choose images</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" multiple onChange={(event) => setImageFiles(Array.from(event.target.files || []))} />
                </label>
                <label className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm transition hover:border-primary ${videoFiles.length ? "border-success bg-success/10" : "border-border bg-secondary/40 hover:bg-secondary"}`}>
                  <Video className="h-7 w-7 text-primary" />
                  <span className="font-medium text-primary-dark">Upload post videos</span>
                  <span className={`max-w-full truncate text-xs ${videoFiles.length ? "font-medium text-success" : "text-muted-foreground"}`}>{videoFiles.length ? `${videoFiles.length} selected - ${videoFiles[0].name}` : "MP4, MOV, WEBM. Multiple allowed."}</span>
                  <span className="mt-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white">Choose videos</span>
                  <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" multiple onChange={(event) => setVideoFiles(Array.from(event.target.files || []))} />
                </label>
              </div>

              {(imageFiles.length > 0 || videoFiles.length > 0) && (
                <div className="grid gap-3 rounded-lg border bg-secondary/20 p-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-primary-dark">Selected images</div>
                      {imageFiles.length > 0 && <Button type="button" size="sm" variant="ghost" onClick={() => setImageFiles([])}>Clear</Button>}
                    </div>
                    <div className="space-y-2">
                      {imageFiles.length === 0 && <div className="rounded-md border bg-background px-3 py-2 text-xs text-muted-foreground">No images selected.</div>}
                      {imageFiles.map((file) => (
                        <div key={`${file.name}-${file.size}`} className="flex min-w-0 items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs">
                          <Camera className="h-4 w-4 shrink-0 text-success" />
                          <span className="min-w-0 flex-1 truncate font-medium">{file.name}</span>
                          <span className="shrink-0 text-muted-foreground">{Math.ceil(file.size / 1024)} KB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-primary-dark">Selected videos</div>
                      {videoFiles.length > 0 && <Button type="button" size="sm" variant="ghost" onClick={() => setVideoFiles([])}>Clear</Button>}
                    </div>
                    <div className="space-y-2">
                      {videoFiles.length === 0 && <div className="rounded-md border bg-background px-3 py-2 text-xs text-muted-foreground">No videos selected.</div>}
                      {videoFiles.map((file) => (
                        <div key={`${file.name}-${file.size}`} className="flex min-w-0 items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs">
                          <Video className="h-4 w-4 shrink-0 text-success" />
                          <span className="min-w-0 flex-1 truncate font-medium">{file.name}</span>
                          <span className="shrink-0 text-muted-foreground">{Math.ceil(file.size / 1024)} KB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <label className="flex items-start gap-3 rounded-lg border p-4 text-sm">
                <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-border" />
                <span>I confirm this post is related to my gala or market yard activity and can be reviewed by the association team.</span>
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Your post will go only to admin. Other Members can see it only after admin reshares it.</p>
                <Button className="bg-saffron text-saffron-foreground hover:bg-saffron/90" disabled={submitting}><Upload className="mr-1 h-4 w-4" /> {submitting ? "Submitting..." : "Submit Post"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-saffron/40 bg-saffron/5">
            <CardContent className="p-6">
              <h2 className="font-display font-bold text-primary-dark">Post guidelines</h2>
              <div className="mt-4 space-y-3 text-sm">
                {["Use clear photos or videos", "Add location or gala details when needed", "Avoid duplicate posts", "Admin approval may be required"].map((item) => (
                  <div key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h2 className="font-display font-bold text-primary-dark">My submitted posts</h2>
              <div className="mt-4 space-y-3">
                {myPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="rounded-lg border p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium text-primary-dark">{post.title_en}</div>
                        <div className="text-xs text-muted-foreground">{post.parsed?.category || "General Request"}</div>
                      </div>
                      <StatusBadge status={postStatusLabel(post.status)} />
                    </div>
                  </div>
                ))}
                {myPosts.length === 0 && <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">No submitted posts yet.</div>}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h2 className="font-display font-bold text-primary-dark">Visible after reshare</h2>
              <p className="mt-2 text-sm text-muted-foreground">Admin-approved posts appear only for the selected Member audience with owner name and download options.</p>
              <Button asChild className="mt-4 w-full bg-saffron text-saffron-foreground hover:bg-saffron/90">
                <Link to="/owner/shared-posts"><Newspaper className="mr-1 h-4 w-4" /> Open Shared Posts</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashLayout>
  );
}

export function OwnerSharedPostsPage() {
  const [resharedPosts, setResharedPosts] = useState<DashboardPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/trader/shared-posts", { credentials: "include" })
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) setResharedPosts(result.posts || []);
        else toast.error(result.error || "Could not load shared posts.");
      })
      .catch(() => toast.error("Could not load shared posts."))
      .finally(() => setLoading(false));
  }, []);

  const imageCount = resharedPosts.reduce((total, post) => total + (post.attachments || []).filter((file) => file.attachment_type === "image").length, 0);
  const videoCount = resharedPosts.reduce((total, post) => total + (post.attachments || []).filter((file) => file.attachment_type === "video").length, 0);

  return (
    <DashLayout kind="owner">
      <PageTitle title="Shared Posts" subtitle="Admin-approved posts visible to your Member category." action={<Button asChild><Link to="/owner/post"><Plus className="mr-1 h-4 w-4" /> Submit Post</Link></Button>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Newspaper} label="Shared posts" value={resharedPosts.length} />
        <StatCard icon={Camera} label="Images available" value={imageCount} tone="saffron" />
        <StatCard icon={Video} label="Videos available" value={videoCount} tone="success" />
      </div>
      <Card className="mb-4 border-border/60 sm:mb-6">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <SearchBar placeholder="Search shared posts..." />
          <Button variant="outline" className="w-full sm:w-auto">All sections</Button>
          <Button variant="outline" className="w-full sm:w-auto">Latest first</Button>
        </CardContent>
      </Card>
      <div className="columns-1 gap-4 xl:columns-2">
        {resharedPosts.map((post) => (
          <div key={post.id} className="mb-4 break-inside-avoid">
            <SharedPostCard post={post} />
          </div>
        ))}
      </div>
      {!loading && resharedPosts.length === 0 && (
        <Card className="border-border/60">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">No admin-reshared posts yet.</CardContent>
        </Card>
      )}
      {loading && (
        <Card className="border-border/60">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">Loading shared posts...</CardContent>
        </Card>
      )}
    </DashLayout>
  );
}

export function ComplaintForm({ compact = false }: { compact?: boolean }) {
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const submitComplaint = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const subject = String(data.get("subject") || "").trim();
    const description = String(data.get("description") || "").trim();
    if (!category || !priority || !subject) {
      toast.error("Category, priority, and subject are required.");
      return;
    }
    setSubmitting(true);
    try {
      const images = await Promise.all(imageFiles.slice(0, 4).map(fileToUploadPayload));
      const videos = await Promise.all(videoFiles.slice(0, 2).map(fileToUploadPayload));
      const response = await fetch("/api/v1/complaints", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description, priority, category, visibility: "admin-only", attachments: { images, videos } }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not submit complaint.");
      toast.success(`Complaint ${result.ticketNumber} sent to admin.`);
      form.reset();
      setImageFiles([]);
      setVideoFiles([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-border/60">
      <CardContent className={compact ? "p-4 sm:p-5" : "p-4 sm:p-6"}>
        <form
          className="grid gap-4"
          onSubmit={submitComplaint}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Complaint category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select complaint category" /></SelectTrigger>
                <SelectContent>
                  {COMPLAINT_CATEGORIES.map((item) => (
                    <SelectItem key={item.en} value={item.en}>{item.en} / {item.mr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{"Priority * / \u092a\u094d\u0930\u093e\u0927\u093e\u0928\u094d\u092f *"}</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue placeholder={"Select Priority / \u092a\u094d\u0930\u093e\u0927\u093e\u0928\u094d\u092f \u0928\u093f\u0935\u0921\u093e"} /></SelectTrigger>
                <SelectContent>
                  {COMPLAINT_PRIORITIES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>{item.en} / {item.mr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Subject *</Label>
            <Input name="subject" required placeholder="Short complaint title" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea name="description" rows={compact ? 4 : 6} placeholder="Describe the issue, location, and urgency clearly..." />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm transition hover:border-primary ${imageFiles.length ? "border-success bg-success/10" : "border-border bg-secondary/40 hover:bg-secondary"}`}>
              <Camera className="h-6 w-6 text-primary" />
              <span className="font-medium text-primary-dark">{imageFiles.length ? `${imageFiles.length} image selected` : "Upload images"}</span>
              <span className={`max-w-full truncate text-xs ${imageFiles.length ? "font-medium text-success" : "text-muted-foreground"}`}>{imageFiles[0]?.name || "JPG, PNG, WEBP"}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" multiple onChange={(event) => setImageFiles(Array.from(event.target.files || []))} />
            </label>
            <label className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm transition hover:border-primary ${videoFiles.length ? "border-success bg-success/10" : "border-border bg-secondary/40 hover:bg-secondary"}`}>
              <Video className="h-6 w-6 text-primary" />
              <span className="font-medium text-primary-dark">{videoFiles.length ? `${videoFiles.length} video selected` : "Upload videos"}</span>
              <span className={`max-w-full truncate text-xs ${videoFiles.length ? "font-medium text-success" : "text-muted-foreground"}`}>{videoFiles[0]?.name || "MP4, MOV, WEBM"}</span>
              <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" multiple onChange={(event) => setVideoFiles(Array.from(event.target.files || []))} />
            </label>
          </div>
          <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">Your complaint will be sent to the admin team for review and assignment.</p>
            <Button className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90 sm:w-auto" disabled={submitting}><Upload className="mr-1 h-4 w-4" /> {submitting ? "Submitting..." : "Submit Complaint"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function MobileChangeApplicationForm({ compact = false }: { compact?: boolean }) {
  const { profile } = useTraderProfile();
  const { lang } = useI18n();
  const displayFullName = localizedDashboardName(lang, profile?.full_name, profile?.full_name_en);

  return (
    <Card className="border-border/60">
      <CardContent className={compact ? "p-5" : "p-6"}>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Mobile number change application submitted");
            (e.currentTarget as HTMLFormElement).reset();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Gala owner name</Label>
              <Input value={displayFullName} disabled />
            </div>
            <div>
              <Label>Gala number</Label>
              <Input value={profile?.gala_number || ""} disabled />
            </div>
            <div>
              <Label>Current registered mobile *</Label>
              <Input value={profile?.mobile || ""} disabled />
            </div>
            <div>
              <Label>New mobile number *</Label>
              <Input required type="tel" inputMode="numeric" pattern="\d{10}" maxLength={10} placeholder="10-digit mobile number" onInput={(event) => { event.currentTarget.value = limitDigits(event.currentTarget.value, 10); }} />
            </div>
            {!compact && (
              <>
                <div>
                  <Label>Alternate contact number</Label>
                  <Input type="tel" inputMode="numeric" pattern="\d{10}" maxLength={10} placeholder="Optional 10-digit number" onInput={(event) => { event.currentTarget.value = limitDigits(event.currentTarget.value, 10); }} />
                </div>
                <div>
                  <Label>Reason for change *</Label>
                  <Select defaultValue={MOBILE_CHANGE_REASONS[0]}>
                    <SelectTrigger className="text-muted-foreground"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MOBILE_CHANGE_REASONS.map((reason) => (
                        <SelectItem key={reason} value={reason} className="text-muted-foreground focus:text-primary-dark">{reason}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          {compact ? (
            <div>
              <Label>Application note</Label>
              <Textarea rows={3} placeholder="Optional note for admin." />
            </div>
          ) : (
            <div>
              <Label>Application note</Label>
              <Textarea rows={4} placeholder="Optional note explaining why the registered mobile number should be changed." />
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 p-4 text-center text-sm transition hover:border-primary hover:bg-secondary">
              <User className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary-dark">Upload ID proof *</span>
              <span className="text-xs text-muted-foreground">Image or PDF</span>
              <input type="file" accept="image/*,.pdf" className="hidden" required />
            </label>
            <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 p-4 text-center text-sm transition hover:border-primary hover:bg-secondary">
              <Phone className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary-dark">Upload mobile proof</span>
              <span className="text-xs text-muted-foreground">Bill, receipt, screenshot</span>
              <input type="file" accept="image/*,.pdf" className="hidden" />
            </label>
          </div>
          <label className="flex items-start gap-3 rounded-lg border p-3 text-sm">
            <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-border" />
            <span>I confirm this new mobile number belongs to me and should be used for portal login and updates.</span>
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">Admin approval is required before the new number becomes active.</p>
            <Button className="bg-saffron text-saffron-foreground hover:bg-saffron/90"><Phone className="mr-1 h-4 w-4" /> Submit Application</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function OwnerMobileChangePage() {
  const { profile } = useTraderProfile();
  const { lang } = useI18n();
  const section = profile?.business_category ? `${profile.business_category} Section` : "";
  const displayFullName = localizedDashboardName(lang, profile?.full_name, profile?.full_name_en);
  const displayBusinessName = localizedDashboardName(lang, profile?.business_name, profile?.business_name_en);
  type TraderMobileRequest = {
    id: number;
    request_code: string;
    old_mobile: string;
    new_mobile: string;
    alternate_mobile: string | null;
    reason: string;
    application_note: string;
    status: string;
    admin_remarks: string | null;
    decided_at: string | null;
    created_at: string;
  };
  const [requests, setRequests] = useState<TraderMobileRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [mobileProofFile, setMobileProofFile] = useState<File | null>(null);

  const loadMobileRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await fetch("/api/v1/trader/mobile-change-requests", { credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not load mobile change requests.");
      setRequests(result.requests || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load mobile change requests.");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadMobileRequests();
  }, []);

  const latestRequest = requests[0] || null;

  const submitMobileChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const newMobile = String(data.get("newMobile") || "").replace(/\D/g, "");
    const alternateMobile = String(data.get("alternateMobile") || "").replace(/\D/g, "");
    const reason = String(data.get("reason") || "").trim();
    const applicationNote = String(data.get("applicationNote") || "").trim();
    if (!/^\d{10}$/.test(newMobile)) {
      toast.error("Enter a valid 10-digit new mobile number.");
      return;
    }
    if (alternateMobile && !/^\d{10}$/.test(alternateMobile)) {
      toast.error("Alternate contact number must be 10 digits.");
      return;
    }
    if (!reason) {
      toast.error("Select a reason for mobile number change.");
      return;
    }
    if (!idProofFile) {
      toast.error("Upload ID proof before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const idProof = await fileToUploadPayload(idProofFile);
      const mobileProof = mobileProofFile ? await fileToUploadPayload(mobileProofFile) : null;
      const response = await fetch("/api/v1/trader/mobile-change-requests", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newMobile, alternateMobile, reason, applicationNote, documents: { idProof, mobileProof } }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not submit mobile change request.");
      toast.success("Mobile change request sent to admin for approval.");
      form.reset();
      setIdProofFile(null);
      setMobileProofFile(null);
      await loadMobileRequests();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit mobile change request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashLayout kind="owner">
      <PageTitle title="Mobile Number Change Application" subtitle="Submit a formal request to update your registered mobile number." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <form className="grid gap-5" onSubmit={submitMobileChange}>
              <div className="rounded-lg bg-secondary/60 p-4">
                <h2 className="font-display font-semibold text-primary-dark">Applicant details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Gala owner name</Label>
                    <Input value={displayFullName} disabled />
                  </div>
                  <div>
                    <Label>Gala number</Label>
                    <Input value={profile?.gala_number || ""} disabled />
                  </div>
                  <div>
                    <Label>Business name</Label>
                    <Input value={displayBusinessName} disabled />
                  </div>
                  <div>
                    <Label>Market section</Label>
                    <Input value={section} disabled />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Current registered mobile *</Label>
                  <Input value={profile?.mobile || ""} disabled />
                </div>
                <div>
                  <Label>New mobile number *</Label>
                  <Input name="newMobile" required type="tel" inputMode="numeric" pattern="\d{10}" maxLength={10} placeholder="10-digit mobile number" onInput={(event) => { event.currentTarget.value = limitDigits(event.currentTarget.value, 10); }} />
                </div>
                <div>
                  <Label>Alternate contact number</Label>
                  <Input name="alternateMobile" type="tel" inputMode="numeric" pattern="\d{10}" maxLength={10} placeholder="Optional 10-digit number" onInput={(event) => { event.currentTarget.value = limitDigits(event.currentTarget.value, 10); }} />
                </div>
                <div>
                  <Label>Reason for change *</Label>
                  <Select name="reason" defaultValue={MOBILE_CHANGE_REASONS[0]}>
                    <SelectTrigger className="text-muted-foreground"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MOBILE_CHANGE_REASONS.map((reason) => (
                        <SelectItem key={reason} value={reason} className="text-muted-foreground focus:text-primary-dark">{reason}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Application note</Label>
                <Textarea name="applicationNote" rows={4} placeholder="Optional note explaining why the registered mobile number should be changed." />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm transition hover:border-primary ${idProofFile ? "border-success bg-success/10" : "border-border bg-secondary/40 hover:bg-secondary"}`}>
                  <User className="h-6 w-6 text-primary" />
                  <span className="font-medium text-primary-dark">{idProofFile ? "ID proof selected" : "Upload ID proof *"}</span>
                  <span className={`max-w-full truncate text-xs ${idProofFile ? "font-medium text-success" : "text-muted-foreground"}`}>{idProofFile ? idProofFile.name : "Aadhaar, PAN, or license image/PDF"}</span>
                  <input type="file" accept="image/*,.pdf" className="hidden" required onChange={(event) => setIdProofFile(event.target.files?.[0] || null)} />
                </label>
                <label className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm transition hover:border-primary ${mobileProofFile ? "border-success bg-success/10" : "border-border bg-secondary/40 hover:bg-secondary"}`}>
                  <Phone className="h-6 w-6 text-primary" />
                  <span className="font-medium text-primary-dark">{mobileProofFile ? "Mobile proof selected" : "Upload mobile proof"}</span>
                  <span className={`max-w-full truncate text-xs ${mobileProofFile ? "font-medium text-success" : "text-muted-foreground"}`}>{mobileProofFile ? mobileProofFile.name : "SIM receipt, bill, or screenshot"}</span>
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={(event) => setMobileProofFile(event.target.files?.[0] || null)} />
                </label>
              </div>

              <label className="flex items-start gap-3 rounded-lg border p-4 text-sm">
                <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-border" />
                <span>I confirm this new mobile number belongs to me and should be used for all future portal login, notices, and complaint updates.</span>
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Admin approval is required before the new number becomes active.</p>
                <Button className="bg-saffron text-saffron-foreground hover:bg-saffron/90" disabled={submitting}><Phone className="mr-1 h-4 w-4" /> {submitting ? "Submitting..." : "Submit Application"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {latestRequest && (
            <Card className="border-border/60">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display font-bold text-primary-dark">My request status</h2>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">{latestRequest.request_code}</div>
                  </div>
                  <StatusBadge status={latestRequest.status} />
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">Requested mobile</div>
                    <div className="font-mono font-medium text-primary-dark">{latestRequest.new_mobile}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">Reason</div>
                    <div className="font-medium text-primary-dark">{latestRequest.reason}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">Admin response</div>
                    <div className="font-medium text-primary-dark">
                      {latestRequest.admin_remarks || (latestRequest.status === "pending" ? "Waiting for admin approval." : "-")}
                    </div>
                    {latestRequest.decided_at && (
                      <div className="mt-1 text-xs text-muted-foreground">{new Date(latestRequest.decided_at).toLocaleString("en-IN")}</div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Submitted on {new Date(latestRequest.created_at).toLocaleString("en-IN")}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="border-saffron/40 bg-saffron/5">
            <CardContent className="p-6">
              <h2 className="font-display font-bold text-primary-dark">Application checklist</h2>
              <div className="mt-4 space-y-3 text-sm">
                {["New mobile must be active", "ID proof is mandatory", "Admin may call for verification", "Approval usually takes 24-48 hours"].map((item) => (
                  <div key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashLayout>
  );
}

type MemberNotification = {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  action_url?: string | null;
  priority: "normal" | "high" | "critical";
  delivery_status: string;
  read_at?: string | null;
  created_at: string;
};

export function OwnerNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<MemberNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openNotification, setOpenNotification] = useState<MemberNotification | null>(null);

  const loadNotifications = async () => {
    const response = await fetch("/api/v1/trader/notifications", { credentials: "include" });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Could not load notifications.");
    const nextNotifications = result.notifications || [];
    const nextUnreadCount = Number(result.unreadCount || 0);
    setNotifications(nextNotifications);
    setUnreadCount(nextUnreadCount);
    syncAppBadgeCount(nextUnreadCount).catch(() => undefined);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        await loadNotifications();
      } catch (error) {
        if (active) toast.error(error instanceof Error ? error.message : "Could not load notifications.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    const timer = window.setInterval(load, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const markRead = async (notification: MemberNotification) => {
    if (!notification.read_at && notification.delivery_status !== "read") {
      const response = await fetch(`/api/v1/trader/notifications/${notification.id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not update notification.");
      await loadNotifications();
    }
    setOpenNotification({ ...notification, delivery_status: "read", read_at: notification.read_at || new Date().toISOString() });
  };

  const markAllRead = async () => {
    const response = await fetch("/api/v1/trader/notifications/read-all", {
      method: "PATCH",
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Could not update notifications.");
    toast.success("Notifications marked as read.");
    await loadNotifications();
  };

  const clearReadNotifications = async () => {
    const response = await fetch("/api/v1/trader/notifications/read", {
      method: "DELETE",
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Could not clear notifications.");
    toast.success(`${Number(result.deleted || 0)} read notification(s) cleared.`);
    await loadNotifications();
  };

  return (
    <DashLayout kind="owner">
      <PageTitle
        title="Notifications"
        subtitle="Payment risk alerts, notices, complaints, and market updates saved to your inbox."
        action={
          <div className="flex flex-wrap gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={() => markAllRead().catch((error) => toast.error(error.message))}>
                Mark all read
              </Button>
            )}
            <Button variant="outline" onClick={() => clearReadNotifications().catch((error) => toast.error(error.message))}>
              Clear read
            </Button>
          </div>
        }
      />
      <Card className="border-border/60">
        <CardContent className="p-6">
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No notifications yet.</div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const unread = !notification.read_at && notification.delivery_status !== "read";
                const isRisk = notification.notification_type === "risk_alert" || notification.priority === "critical";
                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markRead(notification).catch((error) => toast.error(error.message))}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition hover:border-primary/40 hover:bg-secondary/50 ${unread ? "bg-secondary/60" : "bg-background"}`}
                  >
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white ${isRisk ? "bg-destructive" : "bg-primary"}`}>
                      {isRisk ? <ShieldAlert className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-medium text-primary-dark">{notification.title}</div>
                        {unread && <Badge className="bg-saffron text-primary-dark">New</Badge>}
                        {isRisk && <Badge className="bg-destructive text-white">Risk alert</Badge>}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">{notification.message}</div>
                      <div className="mt-2 text-xs text-muted-foreground">{new Date(notification.created_at).toLocaleString("en-IN")}</div>
                    </div>
                    {notification.action_url && <Eye className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={Boolean(openNotification)} onOpenChange={(open) => !open && setOpenNotification(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary-dark">
              {openNotification?.priority === "critical" || openNotification?.notification_type === "risk_alert" ? (
                <ShieldAlert className="h-5 w-5 text-destructive" />
              ) : (
                <Bell className="h-5 w-5 text-primary" />
              )}
              {openNotification?.title}
            </DialogTitle>
            <DialogDescription>
              {openNotification ? new Date(openNotification.created_at).toLocaleString("en-IN") : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className={`rounded-lg border p-4 text-sm ${openNotification?.priority === "critical" || openNotification?.notification_type === "risk_alert" ? "border-destructive/30 bg-destructive/5" : "bg-secondary/40"}`}>
              {openNotification?.message}
            </div>
            {openNotification?.notification_type === "risk_alert" && (
              <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
                This payment risk alert is saved permanently in your notification history. Check the customer risk record before trading further.
              </div>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenNotification(null)}>Close</Button>
              {openNotification?.action_url && (
                <Button
                  className="bg-primary"
                  onClick={() => {
                    const target = openNotification.action_url;
                    setOpenNotification(null);
                    router.navigate({ to: target || "/member/notifications" });
                  }}
                >
                  Open Related Page
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashLayout>
  );
}

export function OwnerHelpPage() {
  return (
    <DashLayout kind="owner">
      <PageTitle title="Help & Support" subtitle="Contact association office or learn how to use portal services." />
      <div className="grid gap-4 md:grid-cols-3"><SupportCard icon={FileText} title="Registration No." body="Maharashtra-1026/2013" /><SupportCard icon={Mail} title="Email support" body="aadateassociation1@gmail.com" /><SupportCard icon={HelpCircle} title="Office address" body="First Floor, Pan Bazar Building, Gultekdi, Pune - 411037" /></div>
      <Card className="mt-6 border-border/60"><CardContent className="p-6"><h2 className="font-display font-bold text-primary-dark">Common help topics</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{["How to raise a complaint", "How to download notices", "How mobile number approval works", "How to update gala profile"].map((t) => <div key={t} className="rounded-lg border p-4 text-sm font-medium text-primary-dark">{t}</div>)}</div></CardContent></Card>
    </DashLayout>
  );
}

export function AdminHelpPage() {
  return (
    <DashLayout kind="admin">
      <PageTitle title="Help & Support" subtitle="Admin support desk, escalation contacts, and portal operating guidance." />
      <div className="grid gap-4 md:grid-cols-3">
        <SupportCard icon={FileText} title="Registration No." body="Maharashtra-1026/2013" />
        <SupportCard icon={Mail} title="Technical support" body="aadateassociation1@gmail.com" />
        <SupportCard icon={HelpCircle} title="Office hours" body="Mon-Sat, 8 AM-6 PM" />
      </div>
      <Card className="mt-6 border-border/60">
        <CardContent className="p-6">
          <h2 className="font-display font-bold text-primary-dark">Admin help topics</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["Approving owner registrations", "Assigning complaints", "Publishing notices and updates", "Exporting reports", "Managing mobile change requests", "Reviewing audit logs"].map((t) => (
              <div key={t} className="rounded-lg border p-4 text-sm font-medium text-primary-dark">{t}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashLayout>
  );
}

function SupportCard({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return <Card className="border-border/60"><CardContent className="p-6"><Icon className="h-6 w-6 text-primary" /><h2 className="mt-3 font-display font-semibold text-primary-dark">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{body}</p></CardContent></Card>;
}

export function OwnerChangePasswordPage() {
  return (
    <DashLayout kind="owner">
      <PageTitle title="Change Password" subtitle="Update your portal password securely." />
      <Card className="max-w-xl border-border/60"><CardContent className="p-6"><form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Password changed"); }}><div><Label>Current password</Label><Input type="password" required /></div><div><Label>New password</Label><Input type="password" required /></div><div><Label>Confirm new password</Label><Input type="password" required /></div><Button className="bg-saffron text-saffron-foreground hover:bg-saffron/90"><KeyRound className="mr-1 h-4 w-4" /> Update Password</Button></form></CardContent></Card>
    </DashLayout>
  );
}

export function AdminChangePasswordPage() {
  return (
    <DashLayout kind="admin">
      <PageTitle title="Change Password" subtitle="Update your admin portal password securely." />
      <Card className="max-w-xl border-border/60">
        <CardContent className="p-6">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Admin password changed"); }}>
            <div><Label>Current password</Label><Input type="password" required /></div>
            <div><Label>New password</Label><Input type="password" required /></div>
            <div><Label>Confirm new password</Label><Input type="password" required /></div>
            <Button className="bg-saffron text-saffron-foreground hover:bg-saffron/90"><KeyRound className="mr-1 h-4 w-4" /> Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </DashLayout>
  );
}












