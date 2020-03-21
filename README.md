# react-suspense-image

Apply React suspense for loading image

---

<blockquote>
When the user is under a slow network or the image size is large, the image will paint step by step which makes the user feel even slower. A solution for that is to display a placeholder and replace it after the image was loaded. In this article, I will demonstrate how to achieve it by using react suspense.
</blockquote>

## Agenda

- [Generate Image Placeholder](#agenda-1)
- [React-Cache](#agenda-2)
- [React-Suspense](#agenda-3)
- [SrcSet](#agenda-4)

### Generate Image Placeholder <a name="agenda-1"></a>

Because we want to display the image when it's fully loaded. We still need to display something during the image loading process.  
A solution is to display the same image with a smaller size. But we will have to generate a smaller version for all our images. This might not be the best solution in some scenarios.  
Another solution I want to show you is to generate a placeholder. Here I generate an SVG base on the size and color we need and encode to Base64. Then we can use it as a placeholder before the image is loaded.

```js
const cache = {};
const generatePlaceholder = (ratio, color) => {
  const width = 1;
  const height = ratio;
  const key = `${ratio},${color}`;

  if (!cache[key]) {
    cache[key] = `data:image/svg+xml;base64, ${window.btoa(
      `<svg height="${height}" width="${width}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${width}" height="${height}" fill="${color}"/>
      </svg>`
    )}`;
  }

  return cache[key];
};
```

### React-Cache <a name="agenda-2"></a>

To use react suspense for the image loading, we will need to apply react cache to create a resource and resolve when image is loaded.

```js
import { unstable_createResource } from "react-cache";

const ImageResource = unstable_createResource(
  src =>
    new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
    })
);
```

If we use this in our application, we will see an error:  
 `Cannot ready property 'readContext' of undefined`

The reason is that the API of React-cache is not ready and it's unstable at the moment.  
So we need to add a patch to fix this issue.
Here I use [patch-package](https://www.npmjs.com/package/patch-package) to handle this problem.

1. install package

```shell
yarn add patch-package postinstall-postinstall
```

2. add postinstall script at package.json

```json
"postinstall": "patch-package"
```

3. modify the code base on the [comment](https://github.com/facebook/react/issues/14575#issuecomment-455096301)
4. generate patch

```shell
yarn patch-package react-cache
```

### React-Suspense <a name="agenda-3"></a>

Now we can apply React suspense to create a lazy load image.  
Here we put our image src into the ImageResource which created through React-cache and use the placeholder as a fallback in React suspense.  
Before the image loaded, the suspense will display the fallback.  
After the image loaded and resolve the resource, the placeholder will be replaced by the original image.

```js
import React, { Suspense } from "react";

const OriImg = ({ src, alt }) => {
  ImageResource.read(src);

  return <img src={src} alt={alt} />;
};

const LazyLoadImg = ({ src, alt, ratio }) => {
  const placeholder = generatePlaceholder(ratio, "black");

  return (
    <Suspense fallback={<img src={placeholder} alt={alt} />}>
      <OriImg src={src} alt={alt} />
    </Suspense>
  );
};
```

The result will look like this. And here is the repository for reference - [react-image-suspense](https://github.com/oahehc/react-image-suspense).

![image-lazy-load](https://i.imgur.com/BFfQj5s.gif)

### SrcSet <a name="agenda-4"></a>

It's worth mentioning that although display a placeholder while the image is loading can increase the user experience. But it won't make the image load faster. Therefore, to provide a proper size of the image is very important.

If we want to display different sizes of the image on our web application base on the screen size. We can use `srcset` attribute on the img tag.

```html
<img sizes="(min-width: 40em) 80vw, 100vw" srcset=" ... " alt="…" />
```

---

## Reference

- [Creating a modern image gallery with React Suspense](https://medium.com/@andrisgauracs/creating-a-modern-image-gallery-with-react-suspense-4e2c1b5a19b7)
- [Cannot ready property 'readContext' of undefined](https://github.com/facebook/react/issues/14575)
- [patch-package](https://www.npmjs.com/package/patch-package)
- [Responsive Images in CSS](https://css-tricks.com/responsive-images-css/)
