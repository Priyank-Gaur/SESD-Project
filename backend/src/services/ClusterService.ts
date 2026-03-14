import {UserRepository} from '../repositories/UserRepository';
export interface ClusterNode {
  id: string;
  name: string;
  email: string;
}
export interface ClusterLink {
  source: string;
  target: string;
  type: 'address'|'device';
}
export interface ClusterData {
  nodes: ClusterNode[];
  links: ClusterLink[];
}
export class ClusterService {
  constructor(private userRepo: UserRepository) {}
  async getAddressClusters(): Promise<{address: string; users: ClusterNode[]}[]> {
    const addresses=await this.userRepo.getDistinctAddresses();
    const clusters: {address: string; users: ClusterNode[]}[]=[];
    for (const address of addresses) {
      const users=await this.userRepo.findByAddress(address);
      if (users.length>=2) {
        clusters.push({
          address,
          users: users.map(u=>({id: u._id.toString(), name: u.name, email: u.email}))
        });
      }
    }
    return clusters;
  }
  async getDeviceClusters(): Promise<{fingerprint: string; users: ClusterNode[]}[]> {
    const fingerprints=await this.userRepo.getDistinctFingerprints();
    const clusters: {fingerprint: string; users: ClusterNode[]}[]=[];
    for (const fp of fingerprints) {
      const users=await this.userRepo.findByDeviceFingerprint(fp);
      if (users.length>=2) {
        clusters.push({
          fingerprint: fp,
          users: users.map(u=>({id: u._id.toString(), name: u.name, email: u.email}))
        });
      }
    }
    return clusters;
  }
  async getAllClusters(): Promise<ClusterData> {
    const addressClusters=await this.getAddressClusters();
    const deviceClusters=await this.getDeviceClusters();
    const nodeMap=new Map<string, ClusterNode>();
    const links: ClusterLink[]=[];
    addressClusters.forEach(cluster=>{
      cluster.users.forEach(u=>nodeMap.set(u.id, u));
      for (let i=0; i<cluster.users.length; i++) {
        for (let j=i+1; j<cluster.users.length; j++) {
          links.push({source: cluster.users[i].id, target: cluster.users[j].id, type: 'address'});
        }
      }
    });
    deviceClusters.forEach(cluster=>{
      cluster.users.forEach(u=>nodeMap.set(u.id, u));
      for (let i=0; i<cluster.users.length; i++) {
        for (let j=i+1; j<cluster.users.length; j++) {
          links.push({source: cluster.users[i].id, target: cluster.users[j].id, type: 'device'});
        }
      }
    });
    return {nodes: Array.from(nodeMap.values()), links};
  }
}
