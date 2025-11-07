<script setup lang="ts">
const { signOut } = useAuth();

onBeforeMount(() => {
  logout();
});

const logout = () => {
  signOut({ callbackUrl: "/login" });
};
</script>
