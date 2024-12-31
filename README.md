# "Setup tosutil" Action for Github Actions

This actions installs [tosutil](https://docs.byteplus.com/en/docs/tos/overview) for use in your GitHub Action steps.

## Inputs

- endpoint: Endpoint of your service, for example: tos-cn-shanghai.volces.com
- region: Region name of your service, for example: cn-shanghai
- access-key-id: Access key ID of your account
- access-key-secret: Secret of the access key
- token: Token

## Usage

```yaml
- uses: banyudu/actions-setup-tosutil@v0
  with:
    endpoint: https://tos-cn-shanghai.volces.com
    access-key-id: ${{ secrets.TOS_ACCESS_KEY_ID }}
    access-key-secret: ${{ secrets.TOS_SECRET_ACCESS_KEY }}
    region: cn-shanghai
- name: Upload to volcengine
  run: |
    tosutil cp -r ./assets tos://<bucket>/ -cacheControl="public,max-age=31536000,immutable" --exclude "*.map"
```

## License

This code is made available under the [MIT License](./LICENSE).