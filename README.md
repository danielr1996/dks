# dks

> ⚠️ Since proxmox was to unstable and unpredictable for me I decided to host my cluster on hetzner and created [dke](https://github.com/danielr1996/dke), therefore this repository is deprecated

dks (danis kubernetes service) is my attempt at hosting a "production-ish ready" kubernetes cluster at home using commodity hardware and opensource or at least free software.

## overview
### goals
I created dks to 
- learn more about Kubernetes, IaC, Automation and Virtualization
- host a kubernetes cluster at home on a single physical host with the ability to scale out, that can be used to run my selfhosted services
- provide a near production expierence, especially regarding ingresses and storage

## layers
dks consists of multiple layers which will be described in the following sections

### physical
The physical layer consists of commodity hardware that I gathered over the years. 
This is nothing special, anything with 8GB+ RAM and 4+ CPU Cores should do, depending on the workload you're trying to run. 

### virtualization
For the virtualization layer I tried various solutions but eventually settled on [proxmox](https://www.proxmox.com/de/), it has it's flaws but worked best for me, so I'm using it for now.
In the future I'd like to get my hands on OpenStack or Harvester/KubeVirt because they seem to be more mature and focused on scalability, whereas proxmox really is only suited for single node deployment and smaller environments.

> As the goal was to host everything at home I didn't consider any VPS vendor, although this might make things much easier as integration in IaC tools like terraform and pulumi are way better than what I've come up with.

> Quick notes on why other tools didn't do the job for me
>
> * Harvester: couldn't even get it to install
> * unRaid: focused mainly on storage, not really on virtualisation
> * XPC-ng: couldn't get the XOA(WebUI) to install
> * OpenStack: no easy way of running on commidity hardware
> * KubeVirt: didn't have enough time to try it out completely

### k8s distribution

For the k8s distribution I choose [k0s](https://docs.k0sproject.io) because it had some features that set it aside from other distributions or installers like k3s or kubeadm:
* the cluster can be defined in yaml and easily installed and destroyed with a single command
* there is no provisioning needed beforehand, k0sctl manages docker, etc
* updates to new kubernetes versions are very fast
* the kubeconfig can be pulled with a simple `k0sctl kubeconfig > ~/kubeconfig` 

### k8s platform

On top of k8s I installed a few other software that was necassary to do useful things with kubernetes

- metallb to provide services of type LoadBalancer
- ingress controller to expose apps to my local network and the internet
- longhorn to provide storage to stateful apps like databases and file servers
