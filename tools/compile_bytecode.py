import frida

with open("dist/bundle.js", "r", encoding="utf-8") as file:
    data = file.read()

    with open("dist/libgene.script.so", "wb") as script:
        script.write(frida.attach(0).compile_script(data))
