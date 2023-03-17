import * as pulumi from "@pulumi/pulumi"
import { DksCluster } from './dks/DksCluster'
import {sshkey, provider} from './credentials'

const stack = pulumi.getStack()
export const cluster =  new DksCluster(`dks-${stack}`,{
    name: `dks-${stack}`,
    controlplane: {
        cores: 2,
        memory: 2048,
        disksize: 10,
        count: 3,
        template: 9000,
    },
    dataplane: {
        cores: 2,
        memory: 1024,
        disksize: 10,
        count: 3,
        template: 9000,
    },
    gateway: '10.0.0.1',
    nameserver: '10.0.0.1',
    subnet: '10.0.111.0/24',
    cidr: '16',
    sshkey
},{provider})