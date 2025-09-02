import { Injectable } from '@angular/core';
import { ShoeModel } from '../../models/product/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public baseProducts : ShoeModel[] = [{
    id: 1,
    name: 'jordans',
    category: {
      id: 1,
      name: 'sport'
    }
  ,
    inventory: 10,
    cost: 40000,
    img_url: [
      'assets/images/jordans1.png',
      'assets/images/jordans2.png'
    ],
    description: 'Air Jordan is a line of basketball and sportswear shoes produced by Nike, Inc. The shoes, related apparel and accessories are now marketed under Jordan Brand. The first Air Jordan shoe was produced for basketball player Michael Jordan during his time with the Chicago Bulls on November 17, 1984, and released to the public on April 1, 1985.[2][3] The shoes were designed for Nike by Peter Moore, Tinker Hatfield, and Bruce Kilgore.[4][5] The Jordan Logo, known as the "Jumpman", originated from a photograph by Jacobus Rentmeester, taken before Jordan played for Team USA in the 1984 Summer Olympics.'
  },
  {
    id: 2,
    name: 'airforce',
    category: {
      id: 3,
      name: 'casual'
    },
    inventory: 10,
    cost: 10000,
    img_url: [
      'assets/images/airforce1.png',
      'assets/images/airforce2.png'
    ],
    description: "The shoes are sold in three different styles: low, mid, and high. The mid comes with a connected strap. The high-top Air Force 1s come with a velcro strap; the mid-top strap is secured to the shoe while the high-top's strap is movable and removable on some versions. Although the shoe comes in different colors and color schemes, the most common Air Force 1s sold are solid white  the second most common being solid black  Another identifying characteristic of an Air Force 1 shoe is a small medallion secured to the bottom of the laces but with holes on both sides so it can be removed by sliding it off the shoe lace. The medallion is engraved with the inscription 'AF-1', with the year "
  },
  {
    id: 3,
    name: 'airmax',
    category: {
      id: 1,
      name: 'sport'
    },
    inventory: 10,
    cost: 15000,
    img_url: [
      'assets/images/airmax1.png',
      'assets/images/airmax2.png'
    ],
    description: 'Air Max shoes are identified by their midsoles incorporating flexible urethane pouches filled with pressurized gas, visible from the exterior of the shoe and intended to provide cushioning to the underfoot'
  },
  {
    id: 4,
    name: 'gucci',
    category: {
      id: 2,
      name: 'formal'
    },
    inventory: 10,
    cost: 30000,
    img_url: [
      'assets/images/gucci1.png',
      'assets/images/gucci2.png'
    ],
    description: "If the soles are made out of synthetic material instead of leather, it's most likely a fake. Authentic Gucci soles should be stamped above the shoe size with “Gucci” and “Made in Italy”. Some Gucci shoes will have a silver or gold plate engraved with “GUCCI” located below the shoe size."
  },
  {
    id: 5,
    name: 'hushpuppies',
    category: {
      id: 2,
      name: 'formal'
    },
    inventory: 10,
    cost: 6000,
    img_url: [
      'assets/images/hushpuppies1.png',
      'assets/images/hushpuppies2.png'
    ],
    description: "It's all in the Shoe. From the very beginning, the revolutionary use of leather protector made Hush Puppies leather scuff, stain and water resistant and changed suede footwear forever."
  }
] 

  constructor() { }

  storeDetails(){
    localStorage.setItem('shoes',JSON.stringify(this.baseProducts))
  }
  
  public getShoes(){
    return JSON.parse(localStorage.getItem('shoes'))
  }

  public addShoe(shoe : ShoeModel){
    let shoes : ShoeModel[] = JSON.parse(localStorage.getItem('shoes'))
    shoes.push(shoe)
    localStorage.setItem('shoes',JSON.stringify(shoes))
  }

  public updateShoe(shoe : ShoeModel){
    let shoes : ShoeModel[] = JSON.parse(localStorage.getItem('shoes'))
    let updateShoeIndex = shoes.findIndex((p)=> p.id === shoe.id)
    if(updateShoeIndex !== -1){
      shoes[updateShoeIndex] ={...shoe}
      localStorage.setItem('shoes',JSON.stringify(shoes))
    }
  }

  public deleteShoe(shoe : ShoeModel){
    let currentShoes:ShoeModel[] = JSON.parse(localStorage.getItem('shoes') || '[]')
    let afterDeletedShoe = currentShoes.filter((p)=> p.id !== shoe.id)
      localStorage.setItem('shoes',JSON.stringify(afterDeletedShoe))
  }

}
