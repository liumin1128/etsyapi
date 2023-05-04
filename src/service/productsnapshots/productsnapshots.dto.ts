export class CreateProductSnapshotDto {
  readonly product: string;
  readonly title: string;
  readonly stars: number;
  readonly pictures: string[];
  readonly sales: number;
  readonly currencyValue: number;
  readonly reviews: number;
  readonly favorites: number;
  readonly kinds: string[];
  readonly tags: string[];
  readonly description: string;
}
