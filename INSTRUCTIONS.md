# dependencies
* pulumi
* k0sctl

# virtualization
> in order to setup the VMs you need a base template to clone from. [proxmox-cloudimages](https://github.com/danielr1996/proxmox-cloudimages) can 
> be used to install an ubuntu cloud image template into proxmox.

```
cd virtualization
cp credentials.example.ts credentials.ts # Fill credentials here
npm install
pulumi up
```

# kubernetes
> [k0sctl](https://github.com/k0sproject/k0sctl) is used to bootstrap the cluster, install according to instructions

```
cd kubernetes
pulumi up
k0sctl apply
k0sctl kubeconfig > kubeconfig
KUBECONFIG=kubeconfig kubectl get nodes
```