export class ImageResponseDto {
  private readonly url: string;
  private readonly key: string;

  constructor(data: any) {
    this.url = data?.Location;
    this.key = data?.key;
  }
}
