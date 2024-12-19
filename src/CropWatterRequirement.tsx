// src/ImageUpload.tsx
import React, {useState, useMemo} from "react";
import {Tabs, Tab} from "@nextui-org/tabs";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader, Chip,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Slider,
  Switch
} from "@nextui-org/react";
import Hearth from "./assets/hearth.svg?react";
import Expert from "./assets/expert.svg?react";
import {useWatterCropPrediction} from "./AIService.ts";

interface CropWaterRequirementFormProps {
  expertMode: boolean;
  version: 'version1' | 'version2';

}

const cropType = [
  {key: 'BANANA', label: "Bananes"},
  {key: 'SOYABEAN', label: "Soja"},
  {key: 'CABBAGE', label: "Chou"},
  {key: 'POTATO', label: "Pomme de terre"},
  {key: 'RICE', label: "Riz"},
  {key: 'MELON', label: "Melon"},
  {key: 'MAIZE', label: "Maïs"},
  {key: 'CITRUS', label: "Citron"},
  {key: 'BEAN', label: "Haricot"},
  {key: 'WHEAT', label: "Blé"},
  {key: 'MUSTARD', label: "Moutarde"},
  {key: 'COTTON', label: "Coton"},
  {key: 'SUGARCANE', label: "Canne à sucre"},
  {key: 'TOMATO', label: "Tomate"},
  {key: 'ONION', label: "Onion"},
]

export default function CropWaterRequirement() {

  const [isSelected, setIsSelected] = useState<boolean>(true);

  return (
      <div className="flex flex-col justify-center gap-10 m-20">
        <div className="flex flex-row flex-1">
          <Switch
              isSelected={isSelected}
              onValueChange={(isSelected) => setIsSelected(isSelected)}
              color="success"
              size="lg"
              thumbIcon={({isSelected, className}) => isSelected ? <Expert heigth="1em" width="1em" className={className} /> : <Hearth heigth="1em" width="1em" className={className} />}
          >
            {isSelected ? "Mode Expert" : "Mode Simplifié"}
          </Switch>
        </div>
        <div className="flex w-full flex-col items-center">
          <Tabs aria-label="Options">
            <Tab key="v1" title="Version 1" className="w-full">
              <CropWaterRequirementForm version='version1' expertMode={isSelected}/>
            </Tab>
            <Tab key="v2" title="Version 2" className="w-full">
              <CropWaterRequirementForm version='version2' expertMode={isSelected}/>
            </Tab>
          </Tabs>
        </div>
      </div>
  );
};

function CropWaterRequirementForm({version, expertMode}: CropWaterRequirementFormProps) {

  const [value, setValue] = React.useState(new Set<string>([]));
  const [soilType, setSoliType] = useState("WET");
  const [region, setRegion] = useState("SEMI-ARID");
  const [tempRange, setTempRange] = useState([10,50]);
  const [temp, setTemp] = useState(10);
  const [climatCondition, setClimatCondition] = useState("SUNNY");
  const [waterPrediction, setWaterPrediction] = useState<null | number>(null);

  const watterCropPrediction = useWatterCropPrediction();

  const canSend = useMemo(() => value.size > 0, [value]);
  const handleEasySend = () => {

  }

  const handleExpertSend = async () => {
    const cropTypeIt = value.values()
    const cropType = cropTypeIt.next().value!

    if (version === 'version1') {
      const data = {
        cropType: cropType,
        soilType: soilType,
        region: region,
        temperature: tempRange.join('-'),
        weatherCondition: climatCondition,
      }

      const res = await watterCropPrediction.getAiPredictionV1(data);
      if(res)
        setWaterPrediction(res.Results.WebServiceOutput0[0]["Scored Labels"])
    }
    else
    {
      const data = {
        cropType: cropType,
        soilType: soilType,
        region: region,
        temperature: temp,
        weatherCondition: climatCondition,
      }
      const res = await watterCropPrediction.getAiPredictionV2(data);
      if(res)
        setWaterPrediction(res.Results.WebServiceOutput0[0]["Scored Labels"]);
    }
  }

  return (
      <Card className="flex-1">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <h4 className="font-bold text-large text-center">Veuillez completer les informations</h4>
        </CardHeader>
        <CardBody className="flex flex-col gap-5">
          <Select
              labelPlacement="outside"
              className="max-w-xs"
              variant="bordered"
              items={cropType}
              selectedKeys={value}
              onSelectionChange={setValue}
              label="Type de plantation"
              placeholder="Selectionnez un type"
          >
            {(crop) => <SelectItem>{crop.label}</SelectItem>}
          </Select>
          <RadioGroup label="Type de sol" orientation="horizontal" value={soilType} onValueChange={setSoliType}>
            <Radio value="HUMID">Humide</Radio>
            <Radio value="WET">Mouillé</Radio>
            <Radio value="DRY">Sec</Radio>
          </RadioGroup>
          <RadioGroup label="Region" orientation="horizontal" value={region} onValueChange={setRegion}>
            <Radio value="DESERT">Désertique</Radio>
            <Radio value="HUMID">Humide</Radio>
            <Radio value="SEMI-ARID">Semi-aride</Radio>
            <Radio value="SEMI-HUMID">Semi-humide</Radio>
          </RadioGroup>
          {version === 'version1' ? (
              <Slider
                  className="max-w-md"
                  defaultValue={[10, 50]}
                  value={tempRange}
                  onChange={setTempRange}
                  label="Température"
                  maxValue={50}
                  minValue={10}
                  showSteps={true}
                  step={1}
              />
          ) : (
              <Slider
                  className="max-w-md"
                  defaultValue={10}
                  value={temp}
                  onChange={setTemp}
                  label="Température"
                  maxValue={50}
                  minValue={10}
                  showSteps={true}
                  step={1}
              />
          )}

          <RadioGroup label="Condition climatique" orientation="horizontal" value={climatCondition} onValueChange={setClimatCondition}>
            <Radio value="SUNNY">Ensoleillé</Radio>
            <Radio value="NORMAL">Normal</Radio>
            <Radio value="RAINY">Pluvieux</Radio>
            <Radio value="WINDY">Venteux</Radio>
          </RadioGroup>
        </CardBody>
        <CardFooter className="flex flex-col gap-4">
          <Button color="primary" isDisabled={!canSend} isLoading={watterCropPrediction.isLoading} onPress={handleExpertSend}>
            Calculer la fraicheur
          </Button>
          {waterPrediction !== null && (
              <Chip color="success">Besoin en eau (L): {waterPrediction}</Chip>
          )}
        </CardFooter>
      </Card>
  );
}

