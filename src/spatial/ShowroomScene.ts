import * as THREE from 'three';
import * as xb from 'xrblocks';
import { store } from '../services/store';

export class ShowroomScene extends xb.Script {
  private displayGroup: THREE.Group = new THREE.Group();
  private perfumeMesh: THREE.Group = new THREE.Group();
  private creamMesh: THREE.Group = new THREE.Group();
  private lipstickMesh: THREE.Group = new THREE.Group();
  private pedestal: THREE.Mesh | null = null;
  private currentItemIndex = 0;
  private products = [
    {
      id: 'PROD-001',
      name: 'Kaiak Clásico Masculino',
      brand: 'Natura',
      price: '$23.400',
      gain: '+$1.800',
      type: 'perfume'
    },
    {
      id: 'PROD-006',
      name: 'Far Away Glamour Eau de Parfum',
      brand: 'AVON',
      price: '$18.850',
      gain: '+$1.450',
      type: 'perfume'
    },
    {
      id: 'PROD-004',
      name: 'Tododia Crema Nutritiva Nuez Pecán',
      brand: 'Natura',
      price: '$10.660',
      gain: '+$820',
      type: 'cream'
    },
    {
      id: 'PROD-008',
      name: 'Power Stay Labial Mate 16h',
      brand: 'AVON',
      price: '$8.060',
      gain: '+$620',
      type: 'lipstick'
    }
  ];

  private card: xb.UICard | null = null;
  private titleText: xb.UIText | null = null;
  private priceText: xb.UIText | null = null;
  private statusText: xb.UIText | null = null;

  init() {
    // Lighting for luxury beauty aesthetic
    const hemiLight = new THREE.HemisphereLight(0xfff5f0, 0xd0c0b8, 2.8);
    this.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff0dd, 2.5);
    dirLight.position.set(1.5, 3.5, 1);
    this.add(dirLight);

    const pointLight = new THREE.PointLight(0xd4af37, 1.5, 5);
    pointLight.position.set(-0.8, 1.8, -0.8);
    this.add(pointLight);

    // Build the marble pedestal
    const pedestalGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.8, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xfaf3ea,
      roughness: 0.2,
      metalness: 0.1
    });
    this.pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    this.pedestal.position.set(0, 0.4, -1.1);
    this.add(this.pedestal);

    // Build 3D models
    this.buildPerfumeBottle();
    this.buildCreamJar();
    this.buildLipstick();

    this.displayGroup.position.set(0, 0.88, -1.1);
    this.displayGroup.add(this.perfumeMesh);
    this.displayGroup.add(this.creamMesh);
    this.displayGroup.add(this.lipstickMesh);
    this.add(this.displayGroup);

    this.updateActiveItemVisibility();

    // Build Spatial UI
    this.buildSpatialUi();
  }

  private buildPerfumeBottle() {
    this.perfumeMesh = new THREE.Group();
    // Glass Body
    const glassGeo = new THREE.BoxGeometry(0.14, 0.22, 0.08);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      metalness: 0
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    this.perfumeMesh.add(glass);

    // Inner Liquid
    const liquidGeo = new THREE.BoxGeometry(0.12, 0.18, 0.06);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0xe8a6ac,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85
    });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.y = -0.01;
    this.perfumeMesh.add(liquid);

    // Golden Spray Cap
    const capGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.06, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2
    });
    const cap = new THREE.Mesh(capGeo, goldMat);
    cap.position.y = 0.14;
    this.perfumeMesh.add(cap);
  }

  private buildCreamJar() {
    this.creamMesh = new THREE.Group();
    // Frosted Glass Jar
    const jarGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.09, 36);
    const jarMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5e5e6,
      roughness: 0.35,
      transmission: 0.7,
      transparent: true
    });
    const jar = new THREE.Mesh(jarGeo, jarMat);
    this.creamMesh.add(jar);

    // Rose Gold Lid
    const lidGeo = new THREE.CylinderGeometry(0.095, 0.095, 0.03, 36);
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0xc78d93,
      metalness: 0.9,
      roughness: 0.15
    });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.y = 0.055;
    this.creamMesh.add(lid);
  }

  private buildLipstick() {
    this.lipstickMesh = new THREE.Group();
    // Base tube
    const baseGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.11, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x221f1e,
      roughness: 0.2,
      metalness: 0.3
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    this.lipstickMesh.add(base);

    // Gold collar
    const collarGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.04, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2
    });
    const collar = new THREE.Mesh(collarGeo, goldMat);
    collar.position.y = 0.05;
    this.lipstickMesh.add(collar);

    // Bullet
    const bulletGeo = new THREE.CylinderGeometry(0.018, 0.02, 0.06, 32);
    const bulletMat = new THREE.MeshStandardMaterial({
      color: 0xb22234,
      roughness: 0.3
    });
    const bullet = new THREE.Mesh(bulletGeo, bulletMat);
    bullet.position.y = 0.09;
    bullet.rotation.x = 0.2;
    this.lipstickMesh.add(bullet);
  }

  private updateActiveItemVisibility() {
    const item = this.products[this.currentItemIndex];
    this.perfumeMesh.visible = item.type === 'perfume';
    this.creamMesh.visible = item.type === 'cream';
    this.lipstickMesh.visible = item.type === 'lipstick';

    if (this.titleText) {
      this.titleText.text = `${item.name} (${item.brand})`;
    }
    if (this.priceText) {
      this.priceText.text = `Público: ${item.price}  |  Ganancia: ${item.gain}`;
    }
    if (this.statusText) {
      this.statusText.text = 'Inspeccioná el producto en 3D o sumalo a tu pedido.';
    }
  }

  private buildSpatialUi() {
    this.titleText = new xb.UIText({
      text: `${this.products[0].name} (${this.products[0].brand})`,
      style: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#383330' }
    });

    this.priceText = new xb.UIText({
      text: `Público: ${this.products[0].price}  |  Ganancia: ${this.products[0].gain}`,
      style: { fontSize: 16, color: '#C5A059', textAlign: 'center', fontWeight: 'bold' }
    });

    this.statusText = new xb.UIText({
      text: 'Inspeccioná el producto en 3D o sumalo a tu pedido.',
      style: { fontSize: 13, textAlign: 'center', opacity: 0.75 }
    });

    const addCartBtn = new xb.UIButton({
      label: 'Agregar al Carrito',
      icon: 'shopping_bag',
      style: { flexGrow: 1, backgroundColor: '#E8C5C8', color: '#231F1D' },
      onClick: () => {
        const item = this.products[this.currentItemIndex];
        store.addToCart(item.id, 1);
        if (this.statusText) {
          this.statusText.text = `¡"${item.name}" agregado a tu carrito! ✨`;
        }
        // Dispatch custom DOM event to update 2D UI badge
        window.dispatchEvent(new CustomEvent('bem-cart-updated'));
      }
    });

    const nextBtn = new xb.UIButton({
      label: 'Siguiente',
      icon: 'arrow_forward',
      style: { flexGrow: 1 },
      onClick: () => {
        this.currentItemIndex = (this.currentItemIndex + 1) % this.products.length;
        this.updateActiveItemVisibility();
      }
    });

    this.card = new xb.UICard({
      size: { width: 0.54, height: 'auto' },
      manipulation: true,
      edge: true,
      style: {
        flexDirection: 'column',
        gap: 12,
        padding: 16,
        backgroundColor: '#FDFBF7ee',
        borderRadius: 20
      },
      children: [
        new xb.UIText({
          text: 'BELLEZA EN TUS MANOS 3D',
          style: { fontSize: 13, fontWeight: 'bold', color: '#C5A059', textAlign: 'center' }
        }),
        this.titleText,
        this.priceText,
        new xb.UIPanel({
          style: { width: '100%', flexDirection: 'row', gap: 10, marginTop: 4 },
          children: [addCartBtn, nextBtn]
        }),
        this.statusText
      ]
    });

    this.card.position.set(0, 1.45, -1.05);
    this.add(this.card);
  }

  update() {
    // Smooth luxury continuous rotation of the 3D model
    if (this.displayGroup) {
      this.displayGroup.rotation.y += 0.01;
    }
  }

  onSelectEnd() {
    // Pinch / click rotates faster or changes product
    if (this.displayGroup) {
      this.displayGroup.rotation.y += 0.3;
    }
  }

  dispose() {
    this.pedestal?.geometry.dispose();
    if (this.pedestal?.material && Array.isArray(this.pedestal.material)) {
      this.pedestal.material.forEach(m => m.dispose());
    } else {
      (this.pedestal?.material as THREE.Material)?.dispose();
    }
  }
}
