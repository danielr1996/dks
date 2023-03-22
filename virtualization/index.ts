import * as pulumi from "@pulumi/pulumi"
import { DksCluster } from './dks/DksCluster'
import {sshkey, provider} from './credentials'

const stack = pulumi.getStack()
export const cluster =  new DksCluster(`dks-${stack}`,{
    name: `dks-${stack}`,
    controlplane: {
        cores: 4,
        memory: 8128,
        disksize: 15,
        count: 1,
        template: 9000,
    },
    dataplane: {
        cores: 4,
        memory: 4096,
        disksize: 15,
        count: 3,
        template: 9000,
    },
    gateway: '10.0.0.1',
    nameserver: '10.0.0.1',
    subnet: '10.0.111.0/24',
    cidr: '16',
    sshkey
},{provider})