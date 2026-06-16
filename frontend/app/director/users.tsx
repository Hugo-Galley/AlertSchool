import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../services/api";
import { AppUser } from "../../services/auth";
import { useAuth } from "../../services/authContext";

export default function ManageUsers() {
  const router = useRouter();
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Champs du formulaire de création
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch {
      Alert.alert("Erreur", "Impossible de charger les comptes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createUser = async () => {
    if (!email || !fullName || !password) {
      Alert.alert("Erreur", "Tous les champs sont requis");
      return;
    }
    setSaving(true);
    try {
      await api.post("/users", {
        email: email.trim(),
        full_name: fullName.trim(),
        password,
        role: "teacher",
      });
      setEmail("");
      setFullName("");
      setPassword("");
      setModalOpen(false);
      await load();
    } catch (err: any) {
      const msg =
        err?.response?.status === 409
          ? "Cet email est déjà utilisé"
          : "Création impossible";
      Alert.alert("Erreur", msg);
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = (u: AppUser) => {
    Alert.alert("Supprimer", `Supprimer le compte de ${u.full_name} ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/users/${u.id}`);
            await load();
          } catch {
            Alert.alert("Erreur", "Suppression impossible");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>👥 Enseignants</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1d3557" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(u) => String(u.id)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.full_name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <Text style={styles.role}>
                  {item.role === "director" ? "Directeur" : "Enseignant"}
                </Text>
              </View>
              {item.id !== me?.id && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteUser(item)}
                >
                  <Text style={styles.deleteText}>Supprimer</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Aucun enseignant.</Text>
          }
        />
      )}

      <TouchableOpacity style={styles.addBtn} onPress={() => setModalOpen(true)}>
        <Text style={styles.addBtnText}>+ Ajouter un enseignant</Text>
      </TouchableOpacity>

      <Modal visible={modalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nouvel enseignant</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom complet"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#2a9d8f" }, saving && { opacity: 0.6 }]}
              onPress={createUser}
              disabled={saving}
            >
              <Text style={styles.modalBtnText}>
                {saving ? "Création…" : "Créer"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#aaa" }]}
              onPress={() => setModalOpen(false)}
            >
              <Text style={styles.modalBtnText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1faee" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  back: { color: "#457b9d", fontSize: 16, fontWeight: "bold", width: 60 },
  title: { fontSize: 18, fontWeight: "bold", color: "#1d3557" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: "bold", color: "#1d3557" },
  email: { color: "#6c757d", marginTop: 2 },
  role: { color: "#457b9d", marginTop: 2, fontSize: 12, fontWeight: "bold" },
  deleteBtn: {
    backgroundColor: "#e63946",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
  empty: { textAlign: "center", color: "#6c757d", marginTop: 40 },
  addBtn: {
    backgroundColor: "#1d3557",
    margin: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: { backgroundColor: "#fff", borderRadius: 16, padding: 24 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1d3557",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    fontSize: 16,
  },
  modalBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  modalBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
