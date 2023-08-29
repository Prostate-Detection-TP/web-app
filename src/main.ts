import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

//PRIME VUE COMPONENTS
import PrimeVue from "primevue/config";
import StyleClass from "primevue/styleclass";
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Textarea from 'primevue/textarea';
import Editor from "primevue/editor";
import Dialog from "primevue/dialog";
import Chip from 'primevue/chip';
import Divider from 'primevue/divider';
import Tag from 'primevue/tag';
import ScrollPanel from 'primevue/scrollpanel';
import Dropdown from "primevue/dropdown";
import 'primeicons/primeicons.css';
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import Checkbox from "primevue/checkbox";
import Password from "primevue/password";
import Toast from "primevue/toast";
import ToastService from 'primevue/toastservice';
import Skeleton from 'primevue/skeleton';
import Chips from "primevue/chips";
import VirtualScroller from "primevue/virtualscroller";
import Image from "primevue/image";
import FileUpload from "primevue/fileupload";
import Breadcrumb from "primevue/breadcrumb";
import ProgressSpinner from "primevue/progressspinner";
import ProgressBar from "primevue/progressspinner";
import Badge from "primevue/progressspinner";
import Avatar from "primevue/avatar";
import SpeedDial from "primevue/speeddial";

//FIRABASE
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider  } from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional



// Initialize Firebase


const app = createApp(App)

app.use(createPinia())

app.use(router);
app.directive("styleclass", StyleClass);
app.use(PrimeVue, {inputStyle: 'filled'});
app.use(ToastService);

app.component('InputText', InputText);
app.component('Button', Button);
app.component('Editor', Editor);
app.component('Card', Card);
app.component('Chip', Chip);
app.component('Divider', Divider);
app.component('Tag', Tag);
app.component('Chips', Chips);
app.component('Textarea', Textarea);
app.component('Image', Image);
app.component('ProgressSpinner', ProgressSpinner)
app.component('FileUpload', FileUpload);
app.component('ScrollPanel', ScrollPanel);
app.component("Dialog", Dialog);
app.component('Checkbox', Checkbox);
app.component('Password', Password)
app.component('Toast', Toast)
app.component('Badge', Badge)
app.component('Breadcrumb', Breadcrumb)
app.component('Avatar', Avatar);
app.component('Dropdown', Dropdown)
app.component('SpeedDial', SpeedDial)
app.component('VirtualScroller', VirtualScroller);
app.component('ProgressBar', ProgressBar);
app.component('Skeleton', Skeleton);

app.mount('#app')
