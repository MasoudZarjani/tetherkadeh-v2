import { useAlertStore } from '~/store/alert';

export default function (address: string) {
    const { showAlert } = useAlertStore();
    navigator.clipboard.writeText(address);
    showAlert({ text: 'کپی شد!', color: 'success' });
}
