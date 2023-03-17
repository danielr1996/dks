import * as pulumi from "@pulumi/pulumi";
import { DksNode } from './DksNode'
import { ComponentResourceOptions } from "@pulumi/pulumi";


export type DksPlaneOpts = {
    name: pulumi.Input<string>,
    count: number,
    template: pulumi.Input<number>,
    memory: pulumi.Input<number>,
    cores: pulumi.Input<number>,
    disksize: pulumi.Input<number>,
    ipaddressgenerator: (index: number)=>string,
    gateway: pulumi.Input<string>,
    nameserver: pulumi.Input<string>,
    sshkey: pulumi.Input<string>,
}
export class DksPlane extends pulumi.ComponentResource {
    public nodes: DksNode[]
    constructor(name: string, args: DksPlaneOpts, opts: ComponentResourceOptions) {
        super("dks:plane", name, args, opts)
        this.nodes = [...Array(args.count).keys()].map(index=>new DksNode(`${name}-${index+1}`, {
            name: pulumi.interpolate`${args.name}-${index+1}`,
            cores: args.cores,
            memory: args.memory,
            disksize: args.disksize,
            gateway: args.gateway,
            ipaddress: args.ipaddressgenerator(index),
            nameserver: args.nameserver,
            sshkey: args.sshkey,
            template: args.template
        }, { parent: this, provider: opts.provider }))
    }
}