export interface Character {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  educationalInfo: string;
  cleanlinessImpact: number;
}

export const gameData = {
  characters: [
    { id: 'char1', name: 'Nong A', image: '👦' },
    { id: 'char2', name: 'Nong B', image: '👧' },
  ] as Character[],
  products: [
    {
      id: 'prod1',
      name: 'แอปเปิ้ล (Apple)',
      image: '🍎',
      educationalInfo: 'แอปเปิ้ลมีกากใยสูง ย่อยง่ายที่กระเพาะอาหารและลำไส้เล็ก!',
      cleanlinessImpact: 10,
    },
    {
      id: 'prod2',
      name: 'ลูกอม (Candy)',
      image: '🍬',
      educationalInfo: 'ลูกอมมีน้ำตาลเยอะ ย่อยที่ปาก แต่ทำให้ฟันผุและท้องอืดได้นะ!',
      cleanlinessImpact: -20,
    },
    {
      id: 'prod3',
      name: 'ข้าว (Rice)',
      image: '🍚',
      educationalInfo: 'ข้าวให้พลังงาน ย่อยที่ปากและลำไส้เล็ก!',
      cleanlinessImpact: 5,
    },
    {
      id: 'prod4',
      name: 'ขนมขบเคี้ยว (Snacks)',
      image: '🍟',
      educationalInfo: 'ของทอดมีไขมันสูง ย่อยยากที่ลำไส้เล็กและทำให้อวัยวะทำงานหนัก!',
      cleanlinessImpact: -15,
    },
    {
      id: 'prod5',
      name: 'น้ำเปล่า (Water)',
      image: '💧',
      educationalInfo: 'น้ำเปล่าช่วยทำความสะอาดระบบย่อยอาหารและดูดซึมที่ลำไส้ใหญ่!',
      cleanlinessImpact: 20,
    }
  ] as Product[]
};
