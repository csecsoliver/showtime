<script setup lang="ts">
import { UFormField } from "#components";
import { ref } from "vue";
import * as z from "zod";
import type { NuxtError } from "#app";
import type { InviteStored, Workshop } from "~~/server/types/types";

const state = ref({
  workshopText: "",
  sendEmails: false,
  emails: "",
  custom: {text: "", public: false}
});
let inviteId: string | null = null; // This will hold the invite ID after creation
let response: Workshop[] = [];
const uploadedFiles: Ref<Array<{name:string, mimeType:string}>> = ref([]);
const fileInput = ref<HTMLInputElement | null>(null);
const schema = z.object({
  workshopText: z.string(),
  sendEmails: z.boolean().optional(),
  emails: z.string().optional(),
  customtext: z.string().optional(),
  custompub: z.boolean().optional(),
});
const items: Ref<string[]> = ref([]);
async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  for (const file of target.files) {
    try {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        const toast = useToast();
        toast.add({
          title: "Fájl túl nagy",
          description: `${file.name} túl nagy. Maximum méret: 10MB`,
          color: "error",
        });
        continue;
      }

      // Basic file type validation (allow common document types)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/csv',
        'application/zip',
        'application/x-yaml',
        'text/yaml'
      ];
      
      if (file.type && !allowedTypes.includes(file.type)) {
        const toast = useToast();
        toast.add({
          title: "Nem támogatott fájltípus",
          description: `${file.name} fájltípusa nem támogatott`,
          color: "error",
        });
        continue;
      }

      const uniqueFileName = generateUniqueFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        const base64Data = result.split(',')[1]; // Remove data:type;base64, prefix
        
        try {
          const uploadResponse = await $fetch("/api/files/upload", {
            method: "POST",
            body: {
              file: base64Data,
              name: uniqueFileName,
              type: file.type
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
          
          uploadedFiles.value.push({
            name: uniqueFileName,
            mimeType: file.type
          });
          
          console.log("File uploaded:", uploadResponse);
        } catch (error: any) {
          console.error("File upload failed:", error);
          const toast = useToast();
          
          switch ((error as NuxtError).statusMessage) {
            case "Forbidden: You don't have permission to upload files":
              toast.add({
                title: "Nincs jogosultsága fájl feltöltéshez",
                color: "error",
              });
              break;
            case "Invalid request body":
              toast.add({
                title: "Érvénytelen kérés",
                color: "error",
              });
              break;
            case "File too large. Maximum size is 10MB":
              toast.add({
                title: "A fájl túl nagy. Maximum méret: 10MB",
                color: "error",
              });
              break;
            default:
              toast.add({
                title: "Fájl feltöltése sikertelen",
                description: "Kérjük, próbálja újra később",
                color: "error",
              });
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
}

function generateUniqueFileName(originalName: string): string {
  const existingFiles = uploadedFiles.value;
  let uniqueName = originalName;
  let counter = 1;
  
  // Extract file extension
  const lastDotIndex = originalName.lastIndexOf('.');
  const nameWithoutExt = lastDotIndex > 0 ? originalName.substring(0, lastDotIndex) : originalName;
  const extension = lastDotIndex > 0 ? originalName.substring(lastDotIndex) : '';
  
  // Keep incrementing until we find a unique name
  while (existingFiles.some(file => file.name === uniqueName)) {
    uniqueName = `${nameWithoutExt} (${counter})${extension}`;
    counter++;
  }
  
  return uniqueName;
}

async function removeFile(fileName: string) {
  try {
    // Remove from server (optional - could implement a delete endpoint)
    // await $fetch(`/api/files/${encodeURIComponent(fileName)}`, { method: 'DELETE' });
    
    // Remove from local list
    uploadedFiles.value = uploadedFiles.value.filter(file => file.name !== fileName);
  } catch (error) {
    console.error("Error removing file:", error);
    // File removal from UI still happens even if server cleanup fails
    uploadedFiles.value = uploadedFiles.value.filter(file => file.name !== fileName);
  }
}

async function submitInvite() {
  const workshopParts = state.value.workshopText.split("(");
  const workshopId = workshopParts[1]?.split(")")[0];
  
  if (!workshopId) {
    console.error("Invalid workshop selection");
    const toast = useToast();
    toast.add({
      title: "Érvénytelen foglalkozás kiválasztás",
      description: "Kérjük, válasszon ki egy érvényes foglalkozást",
      color: "error",
    });
    return;
  }
  
  const data = {
    workshopId: workshopId, // the workshop id is between the parentheses
    custom: state.value.custom.text ? state.value.custom : undefined,
    files: uploadedFiles.value.length > 0 ? uploadedFiles.value : undefined,
  };
  try {
    const response = await $fetch("/api/invites/create", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }) as InviteStored;
    console.log("Invite created:", response);
    inviteId = response.id
    const toast = useToast();
    
    // Copy invite URL to clipboard
    const inviteUrl = `${window.location.origin}/invite/${response.id}`;
    await navigator.clipboard.writeText(inviteUrl);
    
    toast.add({
      title: "Meghívó sikeresen létrehozva",
      description: "URL vágólapra másolva",
      color: "success",
    });
    if (state.value.sendEmails) {
      await sendInvites()
    }
    location.reload();
  } catch (error) {
    console.error("Error creating invite:", error);
    const toast = useToast();
    
    switch ((error as NuxtError).statusMessage) {
      case "unauthorized":
        toast.add({
          title: "Nincs jogosultsága, töltse be újra az oldalt",
          color: "error",
        });
        break;
      case "Missing workshopId":
        toast.add({
          title: "Hiányzó foglalkozás azonosító",
          color: "error",
        });
        break;
      case "Workshop not found":
        toast.add({
          title: "A foglalkozás nem található",
          color: "error",
        });
        break;
      default:
        toast.add({
          title: "Hiba történt a meghívó létrehozása során",
          description: "Kérjük, próbálja újra később",
          color: "error",
        });
    }
  }
}
async function sendInvites() {

  const emails = state.value.emails.split(",").map((email) => email.trim()).filter((email) => email.length > 0);
  if (emails.length == 0){
    return;
  }
  try {
    const response = await $fetch(`/api/email/invite/${inviteId}`, {
      method: "POST",
      body: emails,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Invites sent:", response);
  } catch (error) {
    console.error("Error sending invites:", error);
    const toast = useToast();
    toast.add({
      title: "Hiba történt az emailek küldése során",
      description: "A meghívó létrejött, de az emailek küldése sikertelen",
      color: "error",
    });
  }
}
async function fetchWorkshops() {
  try {
    response = await $fetch<Workshop[]>("/api/workshops", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }) as Workshop[];
    items.value = response.map((workshop: Workshop) => workshop.town + " - " + workshop.time + " (" + workshop.id + ")");
  } catch (error) {
    console.error("Error fetching workshops:", error);
    const toast = useToast();
    toast.add({
      title: "Hiba történt a foglalkozások betöltése során",
      description: "Kérjük, töltse be újra az oldalt",
      color: "error",
    });
  }
}
fetchWorkshops();
</script>
<template>
  <UModal title="Új meghívó létrehozása" size="sm">
    <button class="button">Meghívó</button>

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="submitInvite"
      >
        

        <UFormField label="Foglalkozás" name="workshop">
          <USelectMenu v-model="state.workshopText" :items="items" placeholder="Válassz foglalkozást"/>
        </UFormField>
        <UFormField label="Email küldése" name="sendEmails">
          <UCheckbox v-model="state.sendEmails"/>
        </UFormField>
        <UFormField label="Email címek" name="emails">
          <UInput
            v-model="state.emails"
            type="text"
            placeholder= "Példa: email@example.com, email2@example.com"
          />
        </UFormField>
        <UFormField label="Egyedi meghívószöveg" name="customtext">
          <UInput
            v-model="state.custom.text"
            type="text"
            placeholder="Ez fog megjelenni a megívottak számára"
          />
        </UFormField>
        <UFormField label="Egyedi meghívószöveg publikus?" name="custompub">
          <UCheckbox v-model="state.custom.public"/>
        </UFormField>
        
        <UFormField label="Egyéb dokumentumok" name="files">
          <input 
            ref="fileInput"
            type="file" 
            multiple 
            @change="handleFileUpload"
            style="display: none;"
          />
          <UButton class="button" @click="fileInput?.click()">
            <!-- <Icon name="i-heroicons-document-arrow-up" class="mr-2" /> -->
            Feltöltés
          </UButton>
          <div v-if="uploadedFiles.length > 0" class="uploaded-files-container">
            <p class="uploaded-files-title">Feltöltött dokumentumok:</p>
            <div class="uploaded-files-list">
              <div v-for="file in uploadedFiles" :key="file.name" class="uploaded-file-item">
                <Icon name="i-heroicons-document" class="file-icon" />
                <span class="file-name">{{ file.name }}</span>
                <button @click="removeFile(file.name)" class="remove-file-button">
                  <Icon name="i-heroicons-x-mark" />
                </button>
              </div>
            </div>
          </div>
        </UFormField>
        
        <UButton type="submit"  class="button"> Submit </UButton>
      </UForm>
    </template>
  </UModal>
</template>
<style scoped>
.uploaded-files-container {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--sht-lightpink);
  border-radius: 10px;
  border: 1px solid var(--sht-pink);
}

.uploaded-files-title {
  font-weight: 600;
  color: var(--sht-text);
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.uploaded-files-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.uploaded-file-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid var(--sht-pink);
}

.file-icon {
  color: var(--sht-pink);
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.file-name {
  flex: 1;
  color: var(--sht-text);
  font-size: 0.875rem;
  font-weight: 500;
  margin-right: 0.5rem;
}

.remove-file-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--sht-pink);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-file-button:hover {
  background-color: var(--sht-pinkhighlight);
  transform: scale(1.1);
}

.remove-file-button:active {
  background-color: var(--sht-pinkhighlight2);
  transform: scale(0.95);
}
</style>
