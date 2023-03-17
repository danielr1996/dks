import * as proxmox from "@muhlba91/pulumi-proxmoxve";

export const provider = new proxmox.Provider('proxmoxve', {
    virtualEnvironment: {
        endpoint: 'https://192.168.178.55:8006',
        insecure: true,
        username: 'root@pam',
        password: ''
    }
});
export const sshkey = 'ssh-ed25519 AAAA...'