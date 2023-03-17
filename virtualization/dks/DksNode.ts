import * as pulumi from "@pulumi/pulumi";
import * as proxmox from "@muhlba91/pulumi-proxmoxve";
import { ComponentResourceOptions } from "@pulumi/pulumi";

export type DksNodeOpts = {
    name: pulumi.Input<string>,
    template: pulumi.Input<number>,
    cores: pulumi.Input<number>,
    memory: pulumi.Input<number>,
    disksize: pulumi.Input<number>,
    ipaddress: pulumi.Input<string>,
    gateway: pulumi.Input<string>,
    nameserver: pulumi.Input<string>,
    sshkey: pulumi.Input<string>,
}
export class DksNode extends pulumi.ComponentResource {
    public vm: proxmox.vm.VirtualMachine
    constructor(name: string,args: DksNodeOpts, opts:ComponentResourceOptions) {
        super("dks:node", name, args, opts);
        const getImageDataStore = async(provider: any)=>{
            const dataStores = await proxmox.storage.getDatastores({nodeName: await getNodeName(provider)}, {provider})
            const index = dataStores.contentTypes.findIndex((types:any[])=>types.includes('images'))
            return dataStores.datastoreIds[index]
        }
        
        const getNodeName = async(provider: any)=>{
            const nodes = await proxmox.cluster.getNodes({provider})
            return nodes.names[0]
        }
        const node = getNodeName(opts.provider)
        const datastore = getImageDataStore(opts.provider)
        this.vm = new proxmox.vm.VirtualMachine(name, {
            name: args.name,
            nodeName: node,
            agent: {enabled: true},
            bios: 'seabios',
            cpu: {cores: args.cores},
            tags: ['dks'],
            clone: {
                nodeName: node,
                vmId: args.template,
                full: false,
            },
            disks: [
                {
                    interface: 'scsi0',
                    datastoreId: datastore,
                    size: args.disksize,
                    fileFormat: 'qcow2',
                },
            ],
            memory: {
                dedicated: args.memory,
            },
            networkDevices: [
                {
                    bridge: 'vmbr0',
                    model: 'virtio',
                },
            ],
            onBoot: true,
            operatingSystem: {
                type: 'l26',
            },
            initialization: {
                type: 'nocloud',
                datastoreId: datastore,
                dns: {
                    server: args.nameserver,
                },
                ipConfigs: [
                    {
                        ipv4: {
                            address: args.ipaddress,
                            gateway: args.gateway,
                        },
                    },
                ],
                userAccount: {
                    username: 'ubuntu',
                    keys: [args.sshkey],
                },
            },
        }, {parent: this,provider: opts.provider})
    }
}