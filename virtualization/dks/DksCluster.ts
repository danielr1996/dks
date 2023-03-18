import * as pulumi from "@pulumi/pulumi"
import { ComponentResourceOptions } from "@pulumi/pulumi";
import { DksPlane } from './DksPlane'
var Netmask = require('netmask').Netmask

type DksClusterPlaneOpts = {
    count: number,
    template: pulumi.Input<number>,
    memory: pulumi.Input<number>,
    cores: pulumi.Input<number>,
    disksize: pulumi.Input<number>,
}
export type DksClusterOpts = {
    name: pulumi.Input<string>,
    gateway: pulumi.Input<string>,
    nameserver: pulumi.Input<string>,
    subnet: string,
    cidr: string,
    sshkey: pulumi.Input<string>,
    controlplane: DksClusterPlaneOpts,
    dataplane: DksClusterPlaneOpts,
}
export class DksCluster extends pulumi.ComponentResource {
    public controlplane: DksPlane
    public dataplane: DksPlane
    public name: pulumi.Output<string>
    constructor(name: string, args: DksClusterOpts, opts: ComponentResourceOptions) {
        super("dks:cluster", name, args, opts)
        
        const generateIpAddress = (networkString: string, wantedCidr: string, count: number) => {
            const netmask = new Netmask(networkString)
            const addresses: any[] = []
            netmask.forEach((address: any) => addresses.push(address))
            return {
                address: addresses[count],
                netmask: wantedCidr,
            }
        }
        
        this.name = pulumi.output(args.name)
        this.controlplane = new DksPlane(`${name}-controlplane`, {
            name: pulumi.interpolate`${args.name}-controlplane`,
            cores: args.controlplane.cores,
            memory: args.controlplane.memory,
            disksize: args.controlplane.disksize,
            count: args.controlplane.count,
            gateway: args.gateway,
            nameserver: args.nameserver,
            ipaddressgenerator: (index) => generateIpAddress(args.subnet, args.cidr, index),
            template: args.controlplane.template,
            sshkey: args.sshkey,
        }, { provider: opts.provider })

        this.dataplane = new DksPlane(`${args.name}-dataplane`, {
            name: pulumi.interpolate`${args.name}-dataplane`,
            cores: args.dataplane.cores,
            memory: args.dataplane.memory,
            disksize: args.dataplane.disksize,
            count: args.dataplane.count,
            gateway: args.gateway,
            nameserver: args.nameserver,
            ipaddressgenerator: (index) => generateIpAddress(args.subnet, args.cidr, index + args.controlplane.count),
            template: args.dataplane.template,
            sshkey: args.sshkey,
        }, { provider: opts.provider })
    }
}